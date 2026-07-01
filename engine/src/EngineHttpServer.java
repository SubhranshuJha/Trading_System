import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import model.Order;
import model.OrderCategory;
import model.OrderType;
import model.Trade;
import service.EnginePersistence;
import service.ExchangeService;
import service.OrderBook;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EngineHttpServer {

    private static final ExchangeService exchangeService = new ExchangeService();
    private static EnginePersistence persistence;

    public static void main(String[] args) throws IOException {
        int port = 8080;
        Path dataDir = Path.of("data");

        if (args.length > 0) {
            port = Integer.parseInt(args[0]);
        }
        if (args.length > 1) {
            dataDir = Path.of(args[1]);
        }

        persistence = new EnginePersistence(dataDir);
        persistence.initialize();
        persistence.recover(exchangeService);

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/health", new HealthHandler());
        server.createContext("/orders", new OrdersHandler());
        server.createContext("/orderbook", new OrderBookHandler());
        server.createContext("/recover", new RecoverHandler());
        server.createContext("/persistence/status", new PersistenceStatusHandler());
        server.setExecutor(null);
        server.start();

        System.out.println("Engine HTTP server started on port " + port);
        System.out.println("Persistence data directory: " + dataDir.toAbsolutePath());
    }

    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                writeJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            writeJson(exchange, 200, "{\"status\":\"ok\"}");
        }
    }

    static class PersistenceStatusHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                writeJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String response = "{"
                    + "\"sequence\":" + persistence.getSequence() + ","
                    + "\"knownOrders\":" + persistence.getProcessedOrderIds().size() + ","
                    + "\"snapshot\":" + persistence.buildSnapshot(exchangeService)
                    + "}";
            writeJson(exchange, 200, response);
        }
    }

    static class OrdersHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                writeJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String body = readBody(exchange.getRequestBody());
            Map<String, String> payload = parseFlatJson(body);

            String[] required = {"id", "symbol", "userId", "type", "category", "price", "quantity"};
            for (String field : required) {
                if (!payload.containsKey(field) || payload.get(field).isEmpty()) {
                    writeJson(exchange, 400, "{\"error\":\"Missing field: " + field + "\"}");
                    return;
                }
            }

            try {
                String normalizedSymbol = payload.get("symbol").trim().toUpperCase(Locale.ROOT);
                double price = Double.parseDouble(payload.get("price"));
                int quantity = Integer.parseInt(payload.get("quantity"));

                if (normalizedSymbol.isEmpty()) {
                    writeJson(exchange, 400, "{\"error\":\"symbol cannot be empty\"}");
                    return;
                }
                if (price <= 0) {
                    writeJson(exchange, 400, "{\"error\":\"price must be greater than zero\"}");
                    return;
                }
                if (quantity <= 0) {
                    writeJson(exchange, 400, "{\"error\":\"quantity must be greater than zero\"}");
                    return;
                }

                Order order = new Order(
                        payload.get("id"),
                        normalizedSymbol,
                        payload.get("userId"),
                        OrderType.valueOf(payload.get("type").toUpperCase(Locale.ROOT)),
                        OrderCategory.valueOf(payload.get("category").toUpperCase(Locale.ROOT)),
                        price,
                        quantity
                );

                List<Trade> trades = persistence.placeOrderWithLog(exchangeService, order);
                StringBuilder response = new StringBuilder();
                response.append("{\"remainingQuantity\":").append(order.getQuantity()).append(",\"trades\":[");
                for (int i = 0; i < trades.size(); i++) {
                    if (i > 0) response.append(",");
                    response.append(tradeToJson(trades.get(i)));
                }
                response.append("]}");
                writeJson(exchange, 200, response.toString());
            } catch (NumberFormatException ex) {
                writeJson(exchange, 400, "{\"error\":\"price must be a valid number and quantity must be an integer\"}");
            } catch (IllegalArgumentException ex) {
                writeJson(exchange, 400, "{\"error\":\"Invalid enum values for type/category\"}");
            } catch (Exception ex) {
                ex.printStackTrace();
                writeJson(exchange, 500, "{\"error\":\"Internal server error\"}");
            }
        }
    }

    static class RecoverHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                writeJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String body = readBody(exchange.getRequestBody());
            List<Order> openOrders = parseRecoveryOrders(body);
            int replayed = persistence.replayOpenOrders(exchangeService, openOrders);

            writeJson(
                    exchange,
                    200,
                    "{\"success\":true,\"replayed\":" + replayed + ",\"knownOrders\":"
                            + persistence.getProcessedOrderIds().size() + "}"
            );
        }
    }

    static class OrderBookHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                writeJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String query = exchange.getRequestURI().getQuery();
            String symbol = getQueryParam(query, "symbol");
            if (symbol == null || symbol.isEmpty()) {
                writeJson(exchange, 400, "{\"error\":\"Query param 'symbol' is required\"}");
                return;
            }

            OrderBook orderBook = exchangeService.getOrderBook(symbol.toUpperCase());
            if (orderBook == null) {
                writeJson(exchange, 200, "{\"symbol\":\"" + escapeJson(symbol) + "\",\"buy\":[],\"sell\":[]}");
                return;
            }

            String buy = sideToJson(orderBook.getBuyOrders());
            String sell = sideToJson(orderBook.getSellOrders());
            String response = "{\"symbol\":\"" + escapeJson(symbol) + "\",\"buy\":" + buy + ",\"sell\":" + sell + "}";
            writeJson(exchange, 200, response);
        }
    }

    private static List<Order> parseRecoveryOrders(String body) {
        List<Order> orders = new ArrayList<>();
        Pattern orderPattern = Pattern.compile(
                "\\{\\s*\"id\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"symbol\"\\s*:\\s*\"([^\"]+)\"\\s*,"
                        + "\\s*\"userId\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"type\"\\s*:\\s*\"([^\"]+)\"\\s*,"
                        + "\\s*\"category\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"price\"\\s*:\\s*([0-9.]+)\\s*,"
                        + "\\s*\"quantity\"\\s*:\\s*(\\d+)\\s*\\}"
        );
        Matcher matcher = orderPattern.matcher(body);

        while (matcher.find()) {
            orders.add(new Order(
                    matcher.group(1),
                    matcher.group(2).toUpperCase(Locale.ROOT),
                    matcher.group(3),
                    OrderType.valueOf(matcher.group(4).toUpperCase(Locale.ROOT)),
                    OrderCategory.valueOf(matcher.group(5).toUpperCase(Locale.ROOT)),
                    Double.parseDouble(matcher.group(6)),
                    Integer.parseInt(matcher.group(7))
            ));
        }

        return orders;
    }

    private static String sideToJson(TreeMap<Double, Queue<Order>> side) {
        StringBuilder sb = new StringBuilder("[");
        boolean firstOrder = true;
        for (Map.Entry<Double, Queue<Order>> entry : side.entrySet()) {
            for (Order order : entry.getValue()) {
                if (!firstOrder) sb.append(",");
                firstOrder = false;
                sb.append("{")
                        .append("\"id\":\"").append(escapeJson(order.getId())).append("\",")
                        .append("\"userId\":\"").append(escapeJson(order.getUserId())).append("\",")
                        .append("\"price\":").append(order.getPrice()).append(",")
                        .append("\"quantity\":").append(order.getQuantity())
                        .append("}");
            }
        }
        sb.append("]");
        return sb.toString();
    }

    private static String tradeToJson(Trade trade) {
        return "{"
                + "\"id\":\"" + escapeJson(trade.getId()) + "\","
                + "\"buyOrderId\":\"" + escapeJson(trade.getBuyOrderId()) + "\","
                + "\"sellOrderId\":\"" + escapeJson(trade.getSellOrderId()) + "\","
                + "\"symbol\":\"" + escapeJson(trade.getSymbol()) + "\","
                + "\"price\":" + trade.getPrice() + ","
                + "\"quantity\":" + trade.getQuantity() + ","
                + "\"totalValue\":" + trade.getTotalValue()
                + "}";
    }

    private static String readBody(InputStream inputStream) throws IOException {
        byte[] bytes = inputStream.readAllBytes();
        return new String(bytes, StandardCharsets.UTF_8).trim();
    }

    private static Map<String, String> parseFlatJson(String json) {
        Map<String, String> values = new HashMap<>();
        Pattern pattern = Pattern.compile("\"([A-Za-z0-9_]+)\"\\s*:\\s*(\"[^\"]*\"|-?\\d+(?:\\.\\d+)?|true|false|null)");
        Matcher matcher = pattern.matcher(json);

        while (matcher.find()) {
            String key = matcher.group(1);
            String raw = matcher.group(2);
            if (raw.startsWith("\"") && raw.endsWith("\"")) {
                raw = raw.substring(1, raw.length() - 1);
            }
            values.put(key, raw);
        }
        return values;
    }

    private static String getQueryParam(String query, String key) {
        if (query == null || query.isEmpty()) return null;
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] kv = pair.split("=", 2);
            if (kv.length == 2 && kv[0].equals(key)) {
                return kv[1];
            }
        }
        return null;
    }

    private static String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static void writeJson(HttpExchange exchange, int statusCode, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}

package service;

import model.Order;
import model.OrderCategory;
import model.OrderType;
import model.Trade;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EnginePersistence {

    private static final int SNAPSHOT_INTERVAL = 25;

    private final Path dataDir;
    private final Path walPath;
    private final Path snapshotPath;
    private long sequence = 0;
    private long lastSnapshotSeq = 0;
    private final Set<String> processedOrderIds = new HashSet<>();

    public EnginePersistence(Path dataDir) {
        this.dataDir = dataDir;
        this.walPath = dataDir.resolve("engine-wal.log");
        this.snapshotPath = dataDir.resolve("engine-snapshot.json");
    }

    public Set<String> getProcessedOrderIds() {
        return processedOrderIds;
    }

    public long getSequence() {
        return sequence;
    }

    public void initialize() throws IOException {
        Files.createDirectories(dataDir);
        if (!Files.exists(walPath)) {
            Files.createFile(walPath);
        }
    }

    public void recover(ExchangeService exchangeService) throws IOException {
        if (Files.exists(snapshotPath)) {
            String snapshotJson = Files.readString(snapshotPath, StandardCharsets.UTF_8);
            applySnapshot(exchangeService, snapshotJson);
            System.out.println("Loaded engine snapshot at seq " + lastSnapshotSeq);
        }

        if (!Files.exists(walPath)) {
            return;
        }

        int replayed = 0;
        try (BufferedReader reader = Files.newBufferedReader(walPath, StandardCharsets.UTF_8)) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) {
                    continue;
                }

                Map<String, String> event = parseFlatJson(line);
                long eventSeq = parseLong(event.get("seq"), 0);
                sequence = Math.max(sequence, eventSeq);

                if (eventSeq <= lastSnapshotSeq) {
                    continue;
                }

                if (!"ORDER_SUBMIT".equals(event.get("type"))) {
                    continue;
                }

                String orderId = event.get("orderId");
                if (orderId == null || processedOrderIds.contains(orderId)) {
                    continue;
                }

                Order order = new Order(
                        orderId,
                        event.get("symbol").toUpperCase(Locale.ROOT),
                        event.get("userId"),
                        OrderType.valueOf(event.get("side")),
                        OrderCategory.valueOf(event.get("category")),
                        parseDouble(event.get("price"), 0),
                        parseInt(event.get("quantity"), 0)
                );

                exchangeService.placeOrderInternal(order);
                processedOrderIds.add(orderId);
                replayed++;
            }
        }

        System.out.println(
                "Engine WAL recovery complete. replayed=" + replayed
                        + ", sequence=" + sequence
                        + ", knownOrders=" + processedOrderIds.size()
        );
    }

    public List<Trade> placeOrderWithLog(ExchangeService exchangeService, Order order) throws IOException {
        if (processedOrderIds.contains(order.getId())) {
            System.out.println("Skipping duplicate order id: " + order.getId());
            return List.of();
        }

        appendWal(buildOrderSubmitEvent(order));
        List<Trade> trades = exchangeService.placeOrderInternal(order);

        for (Trade trade : trades) {
            appendWal(buildTradeEvent(trade, order.getId(), order.getQuantity()));
        }

        if (order.getQuantity() > 0 && order.getCatogery() == OrderCategory.LIMIT) {
            appendWal(buildOrderRestedEvent(order));
        }

        processedOrderIds.add(order.getId());
        maybeWriteSnapshot(exchangeService);
        return trades;
    }

    public int replayOpenOrders(ExchangeService exchangeService, List<Order> openOrders) throws IOException {
        int replayed = 0;

        for (Order order : openOrders) {
            if (processedOrderIds.contains(order.getId())) {
                continue;
            }

            appendWal(buildOrderSubmitEvent(order));
            List<Trade> trades = exchangeService.placeOrderInternal(order);

            for (Trade trade : trades) {
                appendWal(buildTradeEvent(trade, order.getId(), order.getQuantity()));
            }

            if (order.getQuantity() > 0 && order.getCatogery() == OrderCategory.LIMIT) {
                appendWal(buildOrderRestedEvent(order));
            }

            processedOrderIds.add(order.getId());
            replayed++;
        }

        if (replayed > 0) {
            maybeWriteSnapshot(exchangeService);
        }

        return replayed;
    }

    private void applySnapshot(ExchangeService exchangeService, String snapshotJson) {
        Map<String, String> snapshot = parseFlatJson(snapshotJson);
        lastSnapshotSeq = parseLong(snapshot.get("lastAppliedSeq"), 0);
        sequence = Math.max(sequence, lastSnapshotSeq);
        processedOrderIds.clear();

        Pattern bookPattern = Pattern.compile(
                "\"([A-Z0-9]+)\"\\s*:\\s*\\{\\s*\"buy\"\\s*:\\s*\\[(.*?)\\]\\s*,\\s*\"sell\"\\s*:\\s*\\[(.*?)\\]\\s*\\}",
                Pattern.DOTALL
        );

        int booksIndex = snapshotJson.indexOf("\"books\"");
        String booksSection = booksIndex >= 0 ? snapshotJson.substring(booksIndex) : snapshotJson;
        Matcher bookMatcher = bookPattern.matcher(booksSection);

        while (bookMatcher.find()) {
            String symbol = bookMatcher.group(1).toUpperCase(Locale.ROOT);
            OrderBook orderBook = new OrderBook();
            loadOrdersIntoBook(orderBook, bookMatcher.group(2), OrderType.BUY, symbol);
            loadOrdersIntoBook(orderBook, bookMatcher.group(3), OrderType.SELL, symbol);
            exchangeService.restoreOrderBook(symbol, orderBook);
        }
    }

    private void loadOrdersIntoBook(
            OrderBook orderBook,
            String ordersJson,
            OrderType side,
            String symbol
    ) {
        Pattern orderPattern = Pattern.compile(
                "\\{\\s*\"id\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"userId\"\\s*:\\s*\"([^\"]+)\"\\s*,"
                        + "\\s*\"category\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"price\"\\s*:\\s*([0-9.]+)\\s*,"
                        + "\\s*\"quantity\"\\s*:\\s*(\\d+)\\s*\\}"
        );
        Matcher matcher = orderPattern.matcher(ordersJson);

        while (matcher.find()) {
            Order order = new Order(
                    matcher.group(1),
                    symbol,
                    matcher.group(2),
                    side,
                    OrderCategory.valueOf(matcher.group(3)),
                    Double.parseDouble(matcher.group(4)),
                    Integer.parseInt(matcher.group(5))
            );
            orderBook.addOrder(order);
            processedOrderIds.add(order.getId());
        }
    }

    private void maybeWriteSnapshot(ExchangeService exchangeService) throws IOException {
        if (sequence - lastSnapshotSeq < SNAPSHOT_INTERVAL) {
            return;
        }

        String snapshot = buildSnapshot(exchangeService);
        Files.writeString(
                snapshotPath,
                snapshot,
                StandardCharsets.UTF_8,
                StandardOpenOption.CREATE,
                StandardOpenOption.TRUNCATE_EXISTING
        );
        lastSnapshotSeq = sequence;
        System.out.println("Engine snapshot written at seq " + lastSnapshotSeq);
    }

    public String buildSnapshot(ExchangeService exchangeService) {
        StringBuilder sb = new StringBuilder();
        sb.append("{\"lastAppliedSeq\":").append(sequence).append(",\"books\":{");

        boolean firstSymbol = true;
        for (Map.Entry<String, OrderBook> entry : exchangeService.getAllOrderBooks().entrySet()) {
            if (!firstSymbol) {
                sb.append(",");
            }
            firstSymbol = false;
            sb.append("\"").append(escapeJson(entry.getKey())).append("\":");
            sb.append(bookToJson(entry.getValue()));
        }

        sb.append("}}");
        return sb.toString();
    }

    private String bookToJson(OrderBook orderBook) {
        return "{\"buy\":" + sideToJson(orderBook.getBuyOrders(), OrderType.BUY)
                + ",\"sell\":" + sideToJson(orderBook.getSellOrders(), OrderType.SELL) + "}";
    }

    private String sideToJson(TreeMap<Double, Queue<Order>> side, OrderType orderType) {
        StringBuilder sb = new StringBuilder("[");
        boolean first = true;

        for (Map.Entry<Double, Queue<Order>> entry : side.entrySet()) {
            for (Order order : entry.getValue()) {
                if (!first) {
                    sb.append(",");
                }
                first = false;
                sb.append(orderToJson(order));
            }
        }

        sb.append("]");
        return sb.toString();
    }

    private String orderToJson(Order order) {
        return "{"
                + "\"id\":\"" + escapeJson(order.getId()) + "\","
                + "\"userId\":\"" + escapeJson(order.getUserId()) + "\","
                + "\"category\":\"" + order.getCatogery().name() + "\","
                + "\"price\":" + order.getPrice() + ","
                + "\"quantity\":" + order.getQuantity()
                + "}";
    }

    private String buildOrderSubmitEvent(Order order) {
        sequence++;
        return "{"
                + "\"seq\":" + sequence + ","
                + "\"ts\":\"" + Instant.now() + "\","
                + "\"type\":\"ORDER_SUBMIT\","
                + "\"orderId\":\"" + escapeJson(order.getId()) + "\","
                + "\"symbol\":\"" + escapeJson(order.getSymbol()) + "\","
                + "\"userId\":\"" + escapeJson(order.getUserId()) + "\","
                + "\"side\":\"" + order.getType().name() + "\","
                + "\"category\":\"" + order.getCatogery().name() + "\","
                + "\"price\":" + order.getPrice() + ","
                + "\"quantity\":" + order.getQuantity()
                + "}";
    }

    private String buildTradeEvent(Trade trade, String takerOrderId, int takerRemainingQty) {
        sequence++;
        return "{"
                + "\"seq\":" + sequence + ","
                + "\"ts\":\"" + Instant.now() + "\","
                + "\"type\":\"TRADE_EXECUTED\","
                + "\"orderId\":\"" + escapeJson(takerOrderId) + "\","
                + "\"tradeId\":\"" + escapeJson(trade.getId()) + "\","
                + "\"buyOrderId\":\"" + escapeJson(trade.getBuyOrderId()) + "\","
                + "\"sellOrderId\":\"" + escapeJson(trade.getSellOrderId()) + "\","
                + "\"symbol\":\"" + escapeJson(trade.getSymbol()) + "\","
                + "\"price\":" + trade.getPrice() + ","
                + "\"quantity\":" + trade.getQuantity() + ","
                + "\"takerRemainingQty\":" + takerRemainingQty
                + "}";
    }

    private String buildOrderRestedEvent(Order order) {
        sequence++;
        return "{"
                + "\"seq\":" + sequence + ","
                + "\"ts\":\"" + Instant.now() + "\","
                + "\"type\":\"ORDER_RESTED\","
                + "\"orderId\":\"" + escapeJson(order.getId()) + "\","
                + "\"symbol\":\"" + escapeJson(order.getSymbol()) + "\","
                + "\"side\":\"" + order.getType().name() + "\","
                + "\"price\":" + order.getPrice() + ","
                + "\"remainingQty\":" + order.getQuantity()
                + "}";
    }

    private void appendWal(String eventLine) throws IOException {
        try (BufferedWriter writer = Files.newBufferedWriter(
                walPath,
                StandardCharsets.UTF_8,
                StandardOpenOption.CREATE,
                StandardOpenOption.APPEND
        )) {
            writer.write(eventLine);
            writer.newLine();
        }
    }

    private static String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static long parseLong(String value, long fallback) {
        try {
            return value == null ? fallback : Long.parseLong(value);
        } catch (NumberFormatException ex) {
            return fallback;
        }
    }

    private static int parseInt(String value, int fallback) {
        try {
            return value == null ? fallback : Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            return fallback;
        }
    }

    private static double parseDouble(String value, double fallback) {
        try {
            return value == null ? fallback : Double.parseDouble(value);
        } catch (NumberFormatException ex) {
            return fallback;
        }
    }

    private static Map<String, String> parseFlatJson(String json) {
        Map<String, String> values = new java.util.HashMap<>();
        Pattern pattern = Pattern.compile(
                "\"([A-Za-z0-9_]+)\"\\s*:\\s*(\"(?:\\\\.|[^\"\\\\])*\"|-?\\d+(?:\\.\\d+)?|true|false|null)"
        );
        Matcher matcher = pattern.matcher(json);

        while (matcher.find()) {
            String key = matcher.group(1);
            String raw = matcher.group(2);
            if (raw.startsWith("\"") && raw.endsWith("\"")) {
                raw = raw.substring(1, raw.length() - 1).replace("\\\"", "\"").replace("\\\\", "\\");
            }
            values.put(key, raw);
        }
        return values;
    }
}

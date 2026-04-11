import model.*;
import service.ExchangeService;

public class Main {

    public static void main(String[] args) {

        ExchangeService exchange = new ExchangeService();

        // BUY limit order
        exchange.placeOrder(new Order(
                "1",
                "TATA",
                "u1",
                OrderType.BUY,
                OrderCategory.LIMIT,
                100,
                10
        ));

        // SELL limit order
        exchange.placeOrder(new Order(
                "2",
                "TATA",
                "u2",
                OrderType.SELL,
                OrderCategory.LIMIT,
                100,
                5
        ));

        // Another SELL limit order
        exchange.placeOrder(new Order(
                "3",
                "TATA",
                "u3",
                OrderType.SELL,
                OrderCategory.LIMIT,
                100,
                5
        ));

        // Check order book
        System.out.println("\nFinal OrderBook:");
        exchange.getOrderBook("TATA").printOrderBook();
    }
}

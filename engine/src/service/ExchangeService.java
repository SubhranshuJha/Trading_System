package service;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import model.Trade;

import model.Order;
import model.OrderCategory;

public class ExchangeService {

    private final HashMap<String, OrderBook> orderBooks = new HashMap<>();
    private final MatchingEngine matchingEngine = new MatchingEngine();

    public List<Trade> placeOrderInternal(Order order) {
        orderBooks.putIfAbsent(order.getSymbol(), new OrderBook());
        OrderBook ob = orderBooks.get(order.getSymbol());

        List<Trade> trades = matchingEngine.match(order, ob);

        if (order.getQuantity() > 0
                && order.getCatogery() == OrderCategory.LIMIT) {
            ob.addOrder(order);
        }

        return trades;
    }

    public OrderBook getOrderBook(String symbol) {
        return orderBooks.get(symbol.toUpperCase(Locale.ROOT));
    }

    public HashMap<String, OrderBook> getAllOrderBooks() {
        return orderBooks;
    }

    public void restoreOrderBook(String symbol, OrderBook orderBook) {
        orderBooks.put(symbol.toUpperCase(Locale.ROOT), orderBook);
    }

    public void clearAll() {
        orderBooks.clear();
    }
}

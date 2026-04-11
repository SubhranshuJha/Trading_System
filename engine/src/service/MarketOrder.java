package service;

import model.*;
import java.util.*;

public class MarketOrder implements OrderHandler {

    @Override
    public List<Trade> handle(Order order, OrderBook orderBook) {
        if (order.getType() == OrderType.BUY) {
            return matchBuy(order, orderBook.getSellOrders());
        }
        return matchSell(order, orderBook.getBuyOrders());
    }

    private List<Trade> matchBuy(Order buyOrder, TreeMap<Integer, Queue<Order>> sellOrders) {
        List<Trade> trades = new ArrayList<>();
        List<Integer> pricesToRemove = new ArrayList<>();

        for (Map.Entry<Integer, Queue<Order>> entry : sellOrders.entrySet()) {
            int price = entry.getKey();
            Queue<Order> queue = entry.getValue();

            while (!queue.isEmpty() && buyOrder.getQuantity() > 0) {
                Order sellOrder = queue.peek();
                int qty = Math.min(buyOrder.getQuantity(), sellOrder.getQuantity());

                trades.add(new Trade(
                    UUID.randomUUID().toString(),
                    buyOrder.getId(),
                    sellOrder.getId(),
                    buyOrder.getSymbol(),
                    price,
                    qty
                ));

                buyOrder.reduceQuantity(qty);
                sellOrder.reduceQuantity(qty);

                if (sellOrder.getQuantity() == 0) queue.poll();
            }

            if (queue.isEmpty()) pricesToRemove.add(price);
            if (buyOrder.getQuantity() == 0) break;
        }

        for (Integer price : pricesToRemove) {
            sellOrders.remove(price);
        }
        return trades;
    }

    private List<Trade> matchSell(Order sellOrder, TreeMap<Integer, Queue<Order>> buyOrders) {
        List<Trade> trades = new ArrayList<>();
        List<Integer> pricesToRemove = new ArrayList<>();

        for (Map.Entry<Integer, Queue<Order>> entry : buyOrders.entrySet()) {
            int price = entry.getKey();
            Queue<Order> queue = entry.getValue();

            while (!queue.isEmpty() && sellOrder.getQuantity() > 0) {
                Order buyOrder = queue.peek();
                int qty = Math.min(sellOrder.getQuantity(), buyOrder.getQuantity());

                trades.add(new Trade(
                    UUID.randomUUID().toString(),
                    buyOrder.getId(),
                    sellOrder.getId(),
                    sellOrder.getSymbol(),
                    price,
                    qty
                ));

                sellOrder.reduceQuantity(qty);
                buyOrder.reduceQuantity(qty);

                if (buyOrder.getQuantity() == 0) queue.poll();
            }

            if (queue.isEmpty()) pricesToRemove.add(price);
            if (sellOrder.getQuantity() == 0) break;
        }

        for ( Integer price : pricesToRemove) {
            buyOrders.remove(price);
        }
        return trades;
    }
}

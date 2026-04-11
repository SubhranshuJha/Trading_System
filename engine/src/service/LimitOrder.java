package service;

import model.*;
import java.util.*;

public class LimitOrder implements OrderHandler {

    @Override
    public List<Trade> handle(Order order, OrderBook orderBook) {
        List<Trade> trades = new ArrayList<>();

        if (order.getType() == OrderType.BUY) {
            return matchBuy(order, orderBook.getSellOrders());
        } else {
            return matchSell(order, orderBook.getBuyOrders());
        }
    }

    private List<Trade> matchBuy(Order order, TreeMap<Integer, Queue<Order>> sellOrders) {
        List<Trade> trades = new ArrayList<>();
        List<Integer> pricesToRemove = new ArrayList<>();

        for (Map.Entry<Integer, Queue<Order>> entry : sellOrders.entrySet()) {
            int price = entry.getKey();

            // Limit buy can only match at or below its limit price.
            if (price > order.getPrice()) {
                break;
            }

            Queue<Order> queue = entry.getValue();

            while (!queue.isEmpty() && order.getQuantity() > 0) {
                Order sellOrder = queue.peek();
                int tradeQty = Math.min(order.getQuantity(), sellOrder.getQuantity());

                trades.add(new Trade(
                        UUID.randomUUID().toString(),
                        order.getId(),
                        sellOrder.getId(),
                        order.getSymbol(),
                        price,
                        tradeQty));

                order.reduceQuantity(tradeQty);
                sellOrder.reduceQuantity(tradeQty);

                if (sellOrder.getQuantity() == 0) {
                    queue.poll();
                }
            }

            if (queue.isEmpty()) {
                pricesToRemove.add(price);
            }

            if (order.getQuantity() == 0) {
                break;
            }
        }

        for (Integer price : pricesToRemove) {
            sellOrders.remove(price);
        }
        return trades;
    }

    private List<Trade> matchSell(Order order, TreeMap<Integer, Queue<Order>> buyOrders) {
        List<Trade> trades = new ArrayList<>();
        List<Integer> pricesToRemove = new ArrayList<>();

        for (Map.Entry<Integer, Queue<Order>> entry : buyOrders.entrySet()) {
            int price = entry.getKey();

            // Limit sell can only match at or above its limit price.
            if (price < order.getPrice()) {
                break;
            }

            Queue<Order> queue = entry.getValue();

            while (!queue.isEmpty() && order.getQuantity() > 0) {
                Order buyOrder = queue.peek();
                int tradeQty = Math.min(order.getQuantity(), buyOrder.getQuantity());

                trades.add(new Trade(
                        UUID.randomUUID().toString(),
                        buyOrder.getId(),
                        order.getId(),
                        order.getSymbol(),
                        price,
                        tradeQty));

                order.reduceQuantity(tradeQty);
                buyOrder.reduceQuantity(tradeQty);

                if (buyOrder.getQuantity() == 0) {
                    queue.poll();
                }
            }

            if (queue.isEmpty()) {
                pricesToRemove.add(price);
            }

            if (order.getQuantity() == 0) {
                break;
            }
        }

        for (Integer price : pricesToRemove) {
            buyOrders.remove(price);
        }
        return trades;
    }
}

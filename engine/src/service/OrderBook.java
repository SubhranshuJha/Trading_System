package service;

import java.util.*;

import model.Order;

public class OrderBook {

    private TreeMap<Integer, Queue<Order>> buyOrders =
            new TreeMap<>(Collections.reverseOrder());

    private TreeMap<Integer, Queue<Order>> sellOrders =
            new TreeMap<>();
    
    public void addOrder(Order order) {
        if (order.getType() == model.OrderType.BUY) {
            buyOrders.putIfAbsent(order.getPrice() , new LinkedList<>());
            buyOrders.get(order.getPrice()).add(order);
        } else {
            sellOrders.putIfAbsent(order.getPrice(), new LinkedList<>());
            sellOrders.get(order.getPrice()).add(order);
        }
    }

    public TreeMap<Integer, Queue<Order>> getBuyOrders() {
        return buyOrders;
    }

    public TreeMap<Integer, Queue<Order>> getSellOrders() {
        return sellOrders;
    }

    public void printOrderBook() {
        System.out.println("BUY Orders:");
        for (Map.Entry<Integer, Queue<Order>> entry : buyOrders.entrySet()) {
            for (Order order : entry.getValue()) {
                System.out.println(order.getId() + " - " + order.getUserId() + " - " + order.getQuantity() + " @ " + order.getPrice());
            }
        }

        System.out.println("SELL Orders:");
        for (Map.Entry<Integer, Queue<Order>> entry : sellOrders.entrySet()) {
            for (Order order : entry.getValue()) {
                System.out.println(order.getId() + " - " + order.getUserId() + " - " + order.getQuantity() + " @ " + order.getPrice());
            }
        }
    }

}
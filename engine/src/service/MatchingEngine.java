package service;

import model.*;
import java.util.*;

public class MatchingEngine {

    public List<Trade> match(Order order, OrderBook orderBook) {
         List<Trade> trades = new ArrayList<>();

         if ( order.getCatogery() == OrderCategory.MARKET ) {
            trades = new MarketOrder().handle(order, orderBook);
         } else if ( order.getCatogery() == OrderCategory.LIMIT ) {
            trades = new LimitOrder().handle(order, orderBook);
         }

         return trades;
    }
}
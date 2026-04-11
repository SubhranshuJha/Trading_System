package service;
import java.util.*;
import model.*;

public interface OrderHandler {
    public List<Trade> handle (Order order, OrderBook orderBook) ;
}


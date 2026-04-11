package model;


public class Order {

    private String id;
    private String symbol ;
    private String userId;
    private OrderType type ;
    private OrderCategory catogery;
    private int price;
    private int quantity;

    public Order(String id, String symbol, String userId, OrderType type, OrderCategory catogery, int price, int quantity) {
        this.id = id;
        this.symbol = symbol;
        this.userId = userId;
        this.type = type;
        this.catogery = catogery;
        this.price = price;
        this.quantity = quantity;
    }

    public String getId() {
        return id;
    }
    public String getSymbol() {
        return symbol;
    }
    public String getUserId() {
        return userId;
    }
    public OrderType getType() {
        return type;
    }
    public OrderCategory getCatogery() {
        return catogery;
    }
    public int getPrice() {
        return price;
    }
    public int getQuantity() {
        return quantity;
    }
    public int reduceQuantity(int qty) {
        this.quantity -= qty;
        return this.quantity;
    }
}
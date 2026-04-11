package model;

public class Trade {

    private String id;
    private String buyOrderId; 
    private String sellOrderId;
    private String symbol;
    private int price;
    private int quantity;

    public Trade(String id, String buyOrderId, String sellOrderId, String symbol, int price, int quantity) {
        this.id = id;
        this.buyOrderId = buyOrderId;
        this.sellOrderId = sellOrderId;
        this.symbol = symbol;
        this.price = price;
        this.quantity = quantity;
    }

    public String getId() {
        return id;
    }

    public String getBuyOrderId() {
        return buyOrderId;
    }

    public String getSellOrderId() {
        return sellOrderId;
    }

    public String getSymbol() {
        return symbol;
    }

    public int getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    public int getTotalValue() {
        return price * quantity;
    }
}
// SPDX-License-Identifier: MIT

pragma solidity >=0.6.00;

// Importing the necessary sol files
import "../core/Ownable.sol";
import "../access/roles/ConsumerRole.sol";
import "../access/roles/DistributorRole.sol";
import "../access/roles/ProducerRole.sol";


// Define a contract 'Supplychain'
contract SupplyChain is
    Ownable,
    DistributorRole,
    ConsumerRole,
    ProducerRole
{
    enum OrderState {
        Ordered,
        PaymentCompleted,
        Completed
    }

    enum OrderItemState {
        Produced,
        Ordered,
        CustomerDeliveryConfirmed,
        Delivered,
        DistributorAdded
    }

    struct Order {
        uint orderId;
        address orderedBy; // consumer metamask address 
        uint totalAmount;
        string location; // order placed location
    }

    struct OrderItem {
        uint orderItemId;
        uint orderId;
        uint productId;
        uint price;
        OrderItemState itemState;
        address distributor;   // distributor address 
        address dispatcher; // dispatcher address
        string location;
    }

    struct Product {
        uint productId;
        string productName;
        string productDesc;
        string producerName;
        uint price; 
        int32 quantity;
        address createdBy;   // producer address
        uint createdDate;
        bool isDeleted;
    }

    struct ActivityLog {
        uint activityId;
        address createdBy; 
        string location;
        uint256 createdDateTime;
        OrderItemState currentState; 
    }

    // Define a variable called productIndex
    uint256 public productIndex;

    // productId -> product
     mapping(uint256 => Product) public productMapping;

    // orderId -> Order
    mapping(uint => Order) orderMapping;
    uint[] orderIndexer;

    // orderItemId -> order item
    mapping(uint => OrderItem) cartMapping;
    uint[] cartIndexer; // cart indexer

    // activityId -> activity log
    mapping(uint => ActivityLog) public activityLog;
    uint logIndexer; // cart indexer
   
    // Define events of Oreder item
    event ItemProduced(uint productId);
    event ItemAddedInCart(uint productId);
    event ItemDispatched(uint productId);
    event ItemDelivered(uint productId);
    event ItemDeliveredCustomerConfirmation(uint productId);

    // Define events for order
    event OrderPlaced(uint orderId);
    event OrderComplete(uint orderId);

    constructor() public payable {
        productIndex = 1;
    }

    // adds a product in the list.
    function addProducts(string calldata product_Name, string calldata product_Desc, string calldata producer_Name, string calldata _location, uint price) public onlyProducer
    {
        productMapping[productIndex] = Product (productIndex, product_Name, product_Desc, producer_Name, price,
        1, msg.sender, block.timestamp, false);
 
        productIndex = productIndex + 1;

        emit ItemProduced(productIndex);

        addLog(_location, OrderItemState.Produced);
    }

    // create a log
    function addLog(string memory _location, OrderItemState _state) public {
     
        activityLog[logIndexer].activityId = logIndexer + 1;
        activityLog[logIndexer].createdBy = msg.sender;
        activityLog[logIndexer].location = _location;
        activityLog[logIndexer].createdDateTime = block.timestamp;
        activityLog[logIndexer].currentState = _state;
        logIndexer++;
    }

    //return logs
    function getLogs() public view returns (ActivityLog[] memory){
        
        ActivityLog[] memory logs = new ActivityLog[](logIndexer);
        
        for (uint i = 0; i < logIndexer; i++) {
            ActivityLog storage log = activityLog[i];
            logs[i] = log;
        }

        return logs;
    }

    //return products
    function getProuducts() public view returns (Product[] memory){
        
        Product[] memory products = new Product[](productIndex-1);
        
        for (uint i = 0; i < productIndex-1 ; i++) {
            Product storage product = productMapping[i+1];
            products[i] = product;
        }

        return products;
    }

    // fetches the product.
    function viewProduct(uint productId) public view returns(uint, uint256, string memory, string memory)
    {
        return (productMapping[productId].productId,
                productMapping[productId].price, 
                productMapping[productId].productName, 
                productMapping[productId].productDesc);
    }

    // adds item in the cart.
    function addItemInCart(uint productId) public onlyConsumer
    {
        uint index = cartIndexer.length + 1;

        cartMapping[index].orderItemId = index;
        cartMapping[index].productId = productId;
        cartMapping[index].itemState = OrderItemState.Ordered;
        cartIndexer.push(index);

        emit ItemAddedInCart(index);  // item added event.
    }

    // view cart item
    function viewCartItems(uint cartIndex) public view onlyConsumer returns(uint, uint, string memory, string memory, uint, OrderItemState)
    {
        uint itemIndex = cartMapping[cartIndex].productId;

        return (cartMapping[cartIndex].productId,
                productMapping[itemIndex].price,
                productMapping[itemIndex].productName, 
                productMapping[itemIndex].productDesc,
                cartMapping[itemIndex].orderId,
                cartMapping[itemIndex].itemState);
    }

    // creates order
    function createOrder(uint _totalAmount, string memory _location) public onlyConsumer
    {
        uint orderIndex = orderIndexer.length + 1;
        
        orderMapping[orderIndex].orderId = orderIndex;
        orderMapping[orderIndex].orderedBy = msg.sender;
        orderMapping[orderIndex].totalAmount = _totalAmount;
        orderMapping[orderIndex].location = _location;

        orderIndexer.push(orderIndex); 
        
        linkCartItems(orderIndex); // link cart items with order.

        emit OrderPlaced(orderIndex);     // emit event order placed.
        addLog(_location, OrderItemState.Ordered);        
    }

    // add orderid to cartItems
    function linkCartItems(uint _orderId) private
    {
        for (uint i = 1; i < cartIndexer.length; i++) {
            cartMapping[i].orderId = _orderId;
        }
    }

    // add distributor 
    function addDistributorToOrderItem(uint _orderItem, address _distributor, string memory _location) public onlyProducer 
    {
        cartMapping[_orderItem].distributor = _distributor;
        addLog(_location, OrderItemState.DistributorAdded);
    }

    // view distributor
    function viewDistributor(uint _orderItem) public view onlyProducer returns (address)
    {
        return (cartMapping[_orderItem].distributor);
    }

    // item delivered distributor confirmation
    function orderDelivered(uint _orderItem, string memory _location) public onlyDistributor 
    {
        if(cartMapping[_orderItem].itemState == OrderItemState.CustomerDeliveryConfirmed)
            cartMapping[_orderItem].itemState = OrderItemState.Delivered;

        emit ItemDelivered(_orderItem);
        addLog(_location, OrderItemState.Delivered);
    }

    // item delivery customer confirmation
    function customerConfirmation(uint _orderItem, string memory _location) public onlyConsumer 
    {
        cartMapping[_orderItem].itemState = OrderItemState.CustomerDeliveryConfirmed;

        emit ItemDeliveredCustomerConfirmation(_orderItem);
        addLog(_location, OrderItemState.CustomerDeliveryConfirmed);
    }

}
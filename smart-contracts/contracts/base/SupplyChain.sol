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
        Ordered,
        CustomerDeliveryConfirmed,
        Delivered,
        Produced,
        DistributorAdded
    }

    struct Order {
        uint orderId;
        address orderedBy;   // consumer address
        uint totalAmount;
        uint cartIndex;
    }

    struct OrderItem {
        uint orderItemId;
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
    uint256 productIndex;

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
    function AddProducts(string calldata product_Name, string calldata product_Desc, string calldata producer_Name, string calldata _location, uint price) public onlyProducer
    {
        productMapping[productIndex-1] = Product (productIndex, product_Name, product_Desc, producer_Name, price,
        1, msg.sender, block.timestamp, false);
 
        productIndex = productIndex + 1;

        emit ItemProduced(productIndex);   // Emit the appropriate event.

        AddLog(_location, OrderItemState.Produced);
    }

    // create a log
    function AddLog(string memory _location, OrderItemState _state) public {
     
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
        
        Product[] memory products = new Product[](productIndex);
        
        for (uint i = 0; i < productIndex-1; i++) {
            Product storage product = productMapping[i];
            products[i] = product;
        }

        return products;
    }

    // fetches the product.
    function ViewProduct(uint productId) public view returns(uint, uint256, string memory, string memory)
    {
        return (productMapping[productId].productId,
                productMapping[productId].price, 
                productMapping[productId].productName, 
                productMapping[productId].productDesc);
    }

    // adds item in the cart.
    function AddItemInCart(uint productId) public onlyConsumer
    {
        uint index = cartIndexer.length + 1;

        cartMapping[index].orderItemId = index;
        cartMapping[index].productId = productId;
        cartMapping[index].itemState = OrderItemState.Ordered;
        cartIndexer.push(index);

        emit ItemAddedInCart(index);  // item added event.
    }

    // view cart item
    function ViewCartItems(uint cartIndex) public view onlyConsumer returns(uint, uint, string memory, string memory, OrderItemState)
    {
        uint itemIndex = cartMapping[cartIndex].productId;

        return (cartMapping[cartIndex].productId,
                productMapping[itemIndex].price,
                productMapping[itemIndex].productName, 
                productMapping[itemIndex].productDesc,
                cartMapping[itemIndex].itemState);
    }

    // creates order
    function CreateOrder(address _consumerAddress, uint _totalAmount, uint _cartIndex, string memory _location) public onlyConsumer
    {
        uint _orderIndex = orderIndexer.length + 1;
        
        orderMapping[_orderIndex].orderId = _orderIndex;
        orderMapping[_orderIndex].cartIndex = _cartIndex;
        orderMapping[_orderIndex].orderedBy = _consumerAddress;
        orderMapping[_orderIndex].totalAmount = _totalAmount;

        orderIndexer.push(_orderIndex); 
        
        emit OrderPlaced(_orderIndex);     // emit event order placed.
        AddLog(_location, OrderItemState.Ordered);        
    }

    // add distributor 
    function AddDistributorToOrderItem(uint _orderItem, address _distributor, string memory _location) public onlyProducer 
    {
        cartMapping[_orderItem].distributor = _distributor;
        AddLog(_location, OrderItemState.DistributorAdded);
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
        AddLog(_location, OrderItemState.Delivered);
    }

    // item delivery customer confirmation
    function customerConfirmation(uint _orderItem, string memory _location) public onlyConsumer 
    {
        cartMapping[_orderItem].itemState = OrderItemState.CustomerDeliveryConfirmed;

        emit ItemDeliveredCustomerConfirmation(_orderItem);
        AddLog(_location, OrderItemState.CustomerDeliveryConfirmed);
    }
}
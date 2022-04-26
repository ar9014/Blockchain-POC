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
        uint productId;
        address createdBy; 
        string location;
        uint256 createdDateTime;
        OrderItemState currentState; 
        string stateInString;
        string createdByName;
    }

    struct TempOrderDetail {
        uint orderId;
        uint price;
        string productDesc;
        string producerName;
        int32 quantity;
    }

    // orderId -> Order
    mapping(uint => TempOrderDetail) tempMapping;
    uint[] tempIndexer;

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

    // totalamount
    uint totalAmount;
   
    // Define events of Oreder item
    event ItemProduced(uint productId);
    event ItemAddedInCart(uint productId);
    event ItemDispatched(uint productId);
    event ItemDelivered(uint productId);
    event ItemDeliveredCustomerConfirmation(uint productId);

    // Define events for order
    event OrderPlaced(uint orderId);
    event OrderComplete(uint orderId);

    constructor() public {
        productIndex = 1;
    }

    // adds a product in the list.
    function addProducts(string calldata product_Name, string calldata product_Desc, string calldata producer_Name, string calldata _location, uint price) public onlyProducer
    {
        productMapping[productIndex] = Product (productIndex, product_Name, product_Desc, producer_Name, price,
        1, msg.sender, block.timestamp, false);
 
        emit ItemProduced(productIndex);

        addLog(_location, OrderItemState.Produced, "Product Added", productIndex, "Producer/Farmer");

        productIndex = productIndex + 1;

    }

    // create a log
    function addLog(string memory _location, OrderItemState _state, string memory _stateInString, uint _productId, string memory _createdByName) public {
     
        activityLog[logIndexer].activityId = logIndexer + 1;
        activityLog[logIndexer].createdBy = msg.sender;
        activityLog[logIndexer].createdByName = _createdByName;
        activityLog[logIndexer].location = _location;
        activityLog[logIndexer].createdDateTime = uint32(block.timestamp);
        activityLog[logIndexer].currentState = _state;
        activityLog[logIndexer].stateInString = _stateInString;
        activityLog[logIndexer].productId = _productId;

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
    function addItemInCart(uint productId, string memory _location) public onlyConsumer
    {
        uint index = cartIndexer.length + 1;   // cartinde

        cartMapping[index].orderItemId = index;
        cartMapping[index].productId = productId;
        cartMapping[index].itemState = OrderItemState.Ordered;
        cartIndexer.push(index);

        addLog(_location, OrderItemState.Ordered, "Product Ordered", productId, "Consumer");  // product added.

        emit ItemAddedInCart(index);  // item added event.
    }

    // view cart item
    function viewCartItems(uint cartIndex) public onlyConsumer returns(uint, uint, string memory, string memory, uint, OrderItemState)
    {
        uint itemIndex = cartMapping[cartIndex].productId;

        totalAmount = totalAmount + productMapping[itemIndex].price;

        return (cartMapping[cartIndex].productId,
                productMapping[itemIndex].price,
                productMapping[itemIndex].productName, 
                productMapping[itemIndex].productDesc,
                cartMapping[itemIndex].orderId,
                cartMapping[itemIndex].itemState);
    }

    // creates order
    function createOrder(string memory _location) public onlyConsumer
    {
        uint orderIndex = orderIndexer.length + 1;
        
        orderMapping[orderIndex].orderId = orderIndex;
        orderMapping[orderIndex].orderedBy = msg.sender;
        orderMapping[orderIndex].totalAmount = totalAmount;  // total order amount;
        orderMapping[orderIndex].location = _location;

        orderIndexer.push(orderIndex); 
        
        linkCartItems(orderIndex); // link cart items with order.

        emit OrderPlaced(orderIndex);     // emit event order placed.      
    }

    // add orderid to cartItems
    function linkCartItems(uint _orderId) private
    {
        for (uint i = 1; i <= cartIndexer.length; i++) {
            cartMapping[i].orderId = _orderId;
        }
    }

    // add distributor 
    function addDistributorToOrderItem(uint _orderItem, address _distributor, string memory _location) public onlyProducer 
    {
        cartMapping[_orderItem].distributor = _distributor;
        addLog(_location, OrderItemState.Ordered, "Picked up for Delivery", cartMapping[_orderItem].productId, "Producer/Farmer");  // distributor added.
    }

    // view distributor
    function viewDistributor(uint _orderItem) public view onlyProducer returns (address)
    {
        return (cartMapping[_orderItem].distributor);
    }

    // item delivered distributor confirmation
    function orderDelivered(uint _orderItem, string memory _location) public onlyDistributor 
    {
        // if(cartMapping[_orderItem].itemState == OrderItemState.CustomerDeliveryConfirmed)
        //     cartMapping[_orderItem].itemState = OrderItemState.Delivered;
        
        emit ItemDelivered(_orderItem);
        addLog(_location, OrderItemState.Ordered, "Delivered to Customer", cartMapping[_orderItem].productId, "Distributor");  // delivered.

    }

    // item delivery customer confirmation
    // function customerConfirmation(uint _orderItem, string memory _location) public onlyConsumer 
    // {
    //     cartMapping[_orderItem].itemState = OrderItemState.CustomerDeliveryConfirmed;

    //     emit ItemDeliveredCustomerConfirmation(_orderItem);
    //     addLog(_location, OrderItemState.CustomerDeliveryConfirmed, "Customer Confirmation", cartMapping[_orderItem].productId); // customer confirmation.
    // }

    // fetches order details
    function viewOrder() public view returns(TempOrderDetail[] memory)
    {
        TempOrderDetail[] memory tempItems = new TempOrderDetail[](cartIndexer.length);

        for (uint i = 0; i < cartIndexer.length ; i++) {
            
            OrderItem storage item = cartMapping[i+1];
            Product storage product = productMapping[i+1];

            tempItems[i].orderId = item.orderId;
            tempItems[i].productDesc = product.productName;
            tempItems[i].producerName = product.productDesc;
            tempItems[i].price = product.price;
            tempItems[i].quantity = 1;

        }

        return tempItems;
    }

}


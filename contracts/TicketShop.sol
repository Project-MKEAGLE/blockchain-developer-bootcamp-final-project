// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract TicketShop {
  address public owner;

  // I had the idea of using an enum to add phases to the ticket sale (presale, public sale, sale over, etc)
  // and allow the seller to set how long these phases can last, but decided to keep it simple for now

  struct Event{
    uint id;
    string name;
    address payable seller;
    uint price;
    uint supply;
    uint amountSold;
    uint saleStart;
    uint saleEnd;
    bool soldOut;
  }

  Event[] public events;

  mapping (address => bool) public isBuyer;
  mapping (address => bool) public isSeller;
  mapping (address => uint) public balances;
  mapping (address => mapping(uint => bool)) public ticketOwned;

  event BuyerRegistered(address buyer, bool status);
  event SellerRegistered(address seller, bool status);
  event EventAdded(uint eventId, address seller);
  event TicketSold(uint eventId, address buyer, uint value);

  modifier onlyBuyer(address _buyer) {
    require(isBuyer[_buyer] == true, "Not registered as a buyer");
    _;
  }

  modifier onlySeller(address _seller) {
    require(isSeller[_seller] == true, "Not registered as a seller");
    _;
  }

  // Registers the user as a buyer
  function registerBuyer() external {
    require(isBuyer[msg.sender] != true, "Already registered");

    isBuyer[msg.sender] = true;

    emit BuyerRegistered(msg.sender, isBuyer[msg.sender]);
  }

  // Registers the user as a seller
  function registerSeller() external {
    require(isSeller[msg.sender] != true, "Already registered");
    
    isSeller[msg.sender] = true;

    emit SellerRegistered(msg.sender, isSeller[msg.sender]);
  }

  // Allows a seller to create an event
  function createEvent(string memory _name, uint _price, uint _supply) external onlySeller(msg.sender) {
    emit EventAdded(events.length, msg.sender);

    events.push(
      Event(
        events.length,
        _name, payable(msg.sender), 
        _price, _supply, 
        0, 
        block.timestamp, 
        block.timestamp + 7 days, 
        false
      )
    );    
  }

  // Allows a buyer to purchase a ticket
  // For now only allows a buyer to own 1 ticker per event
  function buyTicket(uint _eventId) external payable onlyBuyer(msg.sender){
    require(ticketOwned[msg.sender][_eventId] == false, "You've already purchased a ticket");
    require(events[_eventId].soldOut == false, "This event is sold out");
    require(block.timestamp < events[_eventId].saleEnd, "This sale has closed");
    require(msg.value >= events[_eventId].price, "Insufficient transaction value");

    ticketOwned[msg.sender][_eventId] = true;

    events[_eventId].amountSold++;

    if(events[_eventId].amountSold == events[_eventId].supply) {
      events[_eventId].soldOut = true;
    }

    (bool success, ) = events[_eventId].seller.call{value: events[_eventId].price}("");
      require(success, "Transfer failed.");

    emit TicketSold(_eventId, msg.sender, msg.value);
  }

  function getEvents() external view returns(Event[] memory) {
    return events;
  }

  function getTicketOwned(address _owner, uint _eventId) external view returns(bool) {
    return ticketOwned[_owner][_eventId];
  }
}


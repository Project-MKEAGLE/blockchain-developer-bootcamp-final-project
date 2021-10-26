// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketShop {
  address public owner;

  // I had the idea of using an enum to add phases to the ticket sale (presale, public sale, sale over, etc)
  // and allow the seller to set how long these phases can last, but decided to keep it simple for now

  struct Event{
    string name;
    address payable seller;
    uint price;
    uint supply;
    uint amountSold;
    uint saleStart;
    uint saleEnd;
    bool soldOut;
  }

  uint public eventCount;

  mapping (address => bool) isBuyer;
  mapping (address => bool) isSeller;
  mapping (address => uint) balances;
  mapping (uint => Event) events;
  mapping (address => mapping(uint => uint)) tickets;

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
    isBuyer[msg.sender] = true;
  }

  // Registers the user as a seller
  function registerSeller() external {
    isSeller[msg.sender] = true;
  }

  // Allows a seller to create an event
  function createEvent(string memory _name, uint _price, uint _supply) external onlySeller(msg.sender) {
    uint eventId = eventCount;

    events[eventId] = Event({
      name: _name,
      seller: payable(msg.sender),
      price: _price,
      supply: _supply,
      amountSold: 0,
      saleStart: block.timestamp,
      saleEnd: block.timestamp + 7 days,
      soldOut: false
    });

    eventCount++;
  }

  // Allows a buyer to purchase a ticket
  // For now only allows a buyer to own 1 ticker per event
  function buyTicket(uint _eventId) external payable onlyBuyer(msg.sender){
    require(tickets[msg.sender][_eventId] < 1, "You've already purchased a ticket");
    require(events[_eventId].soldOut == false, "This event is sold out");
    require(block.timestamp < events[_eventId].saleEnd, "This sale has closed");

    tickets[msg.sender][_eventId] = 1;

    events[_eventId].amountSold++;

    if(events[_eventId].amountSold == events[_eventId].supply) {
      events[_eventId].soldOut = true;
    }

    (bool success, ) = events[_eventId].seller.call{value: msg.value}("");
      require(success, "Transfer failed.");
  }
}


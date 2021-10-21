// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TicketShop {
  address public owner;

  struct Event{
    string name;
    uint eventId; // Maybe use a hash of event info to identify the event?
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

  modifier onlyBuyer(address _buyer) {
    _;
  }

  modifier onlySeller(address _seller) {
    _;
  }

  // Registers the user as a buyer
  function registerBuyer() external {

  }

  // Registers the user as a seller
  function registerSeller() external {

  }

  // Allows a seller to create an event
  function createEvent(string memory _name, uint _price, uint _supply) external onlySeller(msg.sender) {

  }

  // Allows a buyer to purchase a ticket
  function buyTicket(uint _eventId) external onlyBuyer(msg.sender){

  }

  // Allows a buyer to refund a ticket before a deadline
  function requestRefund() external onlyBuyer(msg.sender){

  }
}

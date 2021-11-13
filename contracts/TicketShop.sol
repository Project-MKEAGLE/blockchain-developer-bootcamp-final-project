// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

  /// @title An event ticket marketplace
  /** @notice This contract allows users to create events and sell tickets to other users.
      Ideally each ticket would be an NFT, but to keep it simple, tickets are just tracked in the Event struct
  */

contract TicketShop {
  address public owner;

  /** @dev Using an enum to add phases to the ticket sale (presale, public sale, sale over, etc)
      and allow the seller to set how long these phases can last can give the seller more control, 
      but decided to keep it simple for now
  */
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

  mapping (address => bool) public isSeller;
  mapping (address => uint) public balances;
  mapping (address => mapping(uint => bool)) public ticketOwned;

  event SellerRegistered(address seller, bool status);
  event EventAdded(uint eventId, address seller);
  event TicketSold(uint eventId, address buyer, uint value);


  /// @notice Only permits registered sellers to execute functions
  /// @dev In the future this would be used for other functions specific to event organizers
  modifier onlySeller(address _seller) {
    require(isSeller[_seller] == true, "Not registered as a seller");
    _;
  }

  /// @notice Registers the user as a seller
  function registerSeller() external {
    require(isSeller[msg.sender] != true, "Already registered");
    
    isSeller[msg.sender] = true;

    emit SellerRegistered(msg.sender, isSeller[msg.sender]);
  }

  /// @notice Allows a seller to create an event
  /// @dev Events are added to an array of events
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

  /// @notice Allows a user to purchase a ticket
  /// @dev For now only allows a buyer to own 1 ticker per event
  function buyTicket(uint _eventId) external payable {
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

  /// @notice Retrieve all events
  /// @return An array of Event structs
  function getEvents() external view returns(Event[] memory) {
    return events;
  }

  /// @notice Sees if a user is an owner of a ticket for an event
  /// @return Boolean value representing ticket ownership
  function getTicketOwned(address _owner, uint _eventId) external view returns(bool) {
    return ticketOwned[_owner][_eventId];
  }
}


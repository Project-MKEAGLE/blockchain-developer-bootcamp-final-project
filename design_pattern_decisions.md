Design Pattern Decisions 

1. Inheritance
    - TicketShop inherits from OpenZeppelin's Ownable.sol contract
    - TicketShop inherits from OpenZeppelin's Pausable.sol contract
2. Access Control 
    - TicketShop restricts the 'pause' and 'unpause' functions to the contract owner
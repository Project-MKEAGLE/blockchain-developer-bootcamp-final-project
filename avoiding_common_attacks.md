Avoiding Common Attacks

1. Using Specifit Compiler Pragma
    - TicketShop uses 'pragma solidity 0.8.4;'
2. Proper Use of Require
    - TicketShop uses require at the beginning of functions to validate certain variables before state changes
3. Use Modifiers Only for Validations 
    - TicketShop only uses modifiers to verify contract ownership for specific functions 
4. Checks-Effects-Interactions
    - TicketShop's 'buyTicket' function avoids state changes after external calls 
5. Proper Use of 'call'
    - TicketShop's 'buyTicket' function properly uses 'call' to send value
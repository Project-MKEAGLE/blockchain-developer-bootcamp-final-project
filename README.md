# Ticket Shop

## Links
Video Walkthrough: https://www.loom.com/share/915668655b184abcab08b61bb075fb13

Netlify URL: https://dreamy-booth-efbd86.netlify.app/

## About
Ticket Shop is a very basic dApp that is designed to demonstrate learnings in the Consensys Academy Blockchain Developer Bootcamp.

Ticket Shop allows anyone with a MetaMask wallet to create events and sell tickets to those events.

This project was built using:
1. Truffle 
2. Web3
3. React
4. OpenZeppelin

Ideally for this type of project, the tickets for each event would be NFTs minted by the event organizer and then be able to bought, sold, and potentially re-sold (giving a percetage of each sale to the original minter), but I didn't want to bite off more than I could chew in this project. Instead it uses Structs and Mappings to track ticket ownership. 

The UI is incomplete since I had some trouble figuring out how to properly implement it based on how I set the code up. Since the way I'm managing events and tickets is suboptimal anyways, I didn't want to spend too much time scratching my head figuring it out. I just wanted to focus on the core learnings of the course so that I could move on to learning about the proper way to implement a project like this (learning to work with NFTs).

For example I wanted to read the value of a nested mapping that returns a bool of whether or not a user owns a certain ticket from my front end and replace the "Buy Now" button with text displaying "Purchased". It kept returning `undefined` on the front end and. I looked for answers but wasn't able to get anything clear. I left the code in the files for reference. It is the `getTicketOwned` function.

## Directory Structure  
1. contracts - contains solidity contracts 
2. migrations - contains Truffle's migration scripts
3. node_modules - created when `npm install` is run
4. test - contains mocha/chai tests for solidity contracts
5. ticketshop - contains all of the front-end UI, created running npx create-react-app 
    1. build - contains optimized code used by Netlify
    2. node_modules
    3. public - contains UI files 
    4. src - contains the front end source code

## Dependencies

1. `npm install -g truffle`
2. `npm install -g @truffle/hdwallet-provider`
3. `npm install -g web3`
4. `npm install -g @openzeppelin/contracts`
5. `npm install -g ganache-cli`

Workflow - Event Organizer(Seller):
1. Connect MetaMask to dApp
2. Register as a Seller
3. Create a new event 
4. Profit

Workflow - Attendee(Buyer):
1. Connect MetaMask to dApp
2. Select a ticket to purchase 
3. Complete transaction using MetaMask

The owner of the smart contract has the ability to pause the contract using functions inhereted from both OpenZeppelin's Ownable.sol and Pausable.sol contracts. Not only will this restrict certain functions on the back end, but they will also restrict access on the front end.

For the sake of practicing certain things in code, I limited the number of tickets each unique account could purchase to 1. Once you purchase a ticket, the "Buy Now" button will be replaced with "Purchase" text.

## Running the Project
1. Start a local Ganache blockchain using either the Ganache GUI or CLI `ganache-cli` . If using CLI, open a second terminal window.
2. Run `truffle compile`
3. Run `truffle migrate` or `truffle migrate --reset` to overwrite any existing.contract instance.
4. Connect MetaMask to Ganache. Steps can be found here https://www.trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask
5. In the terminal, navigate to the `ticketshop` directory and run `nmp run start` to spin up the server for the front end.

## Testing the Solution 
To test, simply make sure your local Ganache network is running and that your  `truffle-config.js` network configuration is set to the correct port. Either 7545 or 8545 depending on how started Ganache.

Then run `truffle test`







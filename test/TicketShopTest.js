const TicketShop = artifacts.require("TicketShop");
let BN = web3.utils.BN;

contract("TicketShop", async (accounts) => {
    const [buyer, seller] = accounts;
    const price = "100"
    const excessAmount = "200"

    let ts;

    beforeEach(async () => {
        // Get the deployed contract
        ts = await TicketShop.new();
        
        // Set accounts at index 0 and 1 to buyer and seller for future tests
        await ts.registerBuyer({from: buyer});
        await ts.registerSeller({from: seller});
      });

    it("should allow a new user to register as a buyer", async () =>{
        // Register accounts[2] as a buyer
        await ts.registerBuyer({from: accounts[2]});

        // Verify that the isBuyer status is set to true
        let status = await ts.isBuyer(accounts[2]);
        
        assert.equal(status, true);
    });

    it("should allow a new user to register as a seller", async () =>{
        // Register accounts[3] as a seller
        await ts.registerSeller({from: accounts[3]});

        // Verify that the isSeller status is set to true
        let status = await ts.isSeller(accounts[3]);
        
        assert.equal(status, true);
    });
    

    it("should allow a seller to create an event", async () => {
        // Create a new event as a seller
        await ts.createEvent("test", 10, 100, {from: seller});

        // Get the new event struct
        let newEvent = await ts.events(0);

        // Verify that the event name, price, and supply are equal to the seller's inputs
        assert.equal(
            newEvent.name, 
            "test",
            "The name of the event should be 'test'"
            );
        assert.equal(newEvent.price, 10);
        assert.equal(newEvent.supply, 100);
    })

    it("should allow a buyer to purchase a ticket from an event", async () => {
        // Create a new event as a seller
        await ts.createEvent("test", price, 100, {from: seller});

        // Get the buyer's and seller's balances before the transaction
        let sellerBalanceBefore = web3.eth.getBalance(seller);
        let buyerBalanceBefore = web3.eth.getBalance(buyer);

        // Purchase a ticket as a buyer
        await ts.buyTicket(0, {value: excessAmount, from: buyer});

        // Get the event's values after the purchase
        let newEvent = await ts.events(0);

        // Get the number of tickets owned by the buyer
        let owned = await ts.tickets(buyer, 0);

        // Get the buyer's and seller's balances after the transaction
        let sellerBalanceAfter = await web3.eth.getBalance(seller);
        let buyerBalanceAfter = await web3.eth.getBalance(buyer);

        // Verify that the event has successfully sold a ticket
        assert.equal(
            newEvent.amountSold, 
            1,
            "The number of tickets sold should be equal to 1"
            );
        
        // Verify that the buyer has successfully purchased a ticket
        assert.equal(
            owned, 
            1,
            "The number of tickets owned by the buyer should be equal to 1"
            );
        
        // Verify that the seller has received the correct payment for the ticket
        assert.equal(
            new BN(sellerBalanceAfter).toString(),
            new BN(sellerBalanceBefore).add(new BN(price)).toString(),
            "The buyer's balance should be increased by the price of the ticket"
            );
        
        // Verify that the buyer has payed the correct price for the ticket
        assert.isBelow(
            Number(buyerBalanceAfter),
            Number(new BN(buyerBalanceBefore).sub(new BN(price))),
            "The seller's balance should be reduced by more than the price of the ticket (including gas costs)"
            );

    })
})
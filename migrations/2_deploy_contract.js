const TicketShop = artifacts.require("TicketShop");

module.exports = function (deployer) {
  deployer.deploy(TicketShop);
};

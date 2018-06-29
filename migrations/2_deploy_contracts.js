var CryptoSoccrToken = artifacts.require('CryptoSoccrToken');

module.exports = function (deployer) {
  deployer.deploy(CryptoSoccrToken);
};

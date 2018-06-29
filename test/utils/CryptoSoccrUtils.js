module.exports = function (CryptoSoccr, accounts) {
  // checks whether the expected value of totalSupply is the current value
  function checksTotalSupply (expectedValue) {
    it('totalSupply should be equal to ' + expectedValue, function (done) {
        CryptoSoccr.deployed().then(function (instance) {
        instance.totalSupply.call().then(function (totalSupply) {
        assert.equal(totalSupply, expectedValue
          , 'totalSupply is not equal to ' + expectedValue);
        }).then(done).catch(done);
      });
    });
  };

  function checkPlayerCreation (name,id) {
    it('createToken should create a player  named ' + name, function (done) {
        CryptoSoccr.deployed().then(async function (instance) {
        await instance.createContractPlayer(name,id,{ from: accounts[0] })
        .then(function (result) {
          assert.include(result.logs[0].event, 'Birth', 'Birth event was not triggered');
          //birth should be map with datbase 
          //mongodb
         assert.equal(result.logs[0].args.name, name);
        });
      }).then(done).catch(done);
    });
  };
 

  function checkPlayerPurchase (tokenId, price) {
    it('purchase should allow us to buy player tokenId: ' + tokenId, function (done) {
        CryptoSoccr.deployed().then(async function (instance) {
        await instance.purchase(tokenId, {
          from: accounts[0],
          value: web3.toWei(price, 'ether')
        })
        .then(function (result) {
          assert.include(result.logs[0].event, 'Transfer', 'Transfer event was not triggered');
         // assert.equal(result.logs[0].args._tokenId, tokenId);
        //   assert.include(result.logs[1].event, 'TokenSold', 'TokenSold event was not triggered');
        //   assert.equal(result.logs[1].args.tokenId, tokenId);
          // Confirm new contract balance
          var contractBalance = web3.fromWei(web3.eth.getBalance(instance.address), 'ether');
             console.log('\t' + contractBalance.valueOf() + ' eth');
         });
      }).then(done).catch(done);
    });
  };

  function setCeo() {
    it('address should be set as ceo ' +  accounts[0] , function (done) {
        CryptoSoccr.deployed().then(function (instance) {
        instance.setCEO.call(accounts[0])
        .then(function(result) {            
            done();
        });
      }).then(done).catch(done);
    });
  };

  function checkWithdrawal (withdrawAmount) {
    it('withdrawBalance should withdraw ' + withdrawAmount + ' eth', function (done) {
        CryptoSoccr.deployed().then(function (instance) {
        instance.withdrawBalance(accounts[0], web3.toWei(withdrawAmount, 'ether'), {
          from: accounts[0]
        })
        .then(function (result) {
            var contractBalance = web3.fromWei(web3.eth.getBalance(instance.address), 'ether');
            assert.equal(contractBalance, 0.0);
        });
      }).then(done).catch(done);
    });
  };

  return {
  /** Token Details */
    checksTotalSupply: checksTotalSupply,
    checkPlayerCreation: checkPlayerCreation,
    checkPlayerPurchase: checkPlayerPurchase,
    checkWithdrawal: checkWithdrawal,
    setCeo:setCeo
  };
};

var express = require('express');

var abi = require('../lib/abi');

var router = express.Router();

var fs = require('fs');

var Web3 = require('web3');

var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var txutils = lightwallet.txutils;



var address = '0x4b50b032F3b256efCDED54d78F3E78f46bC84884';
var address2 = '0x59cAAF339bBe84750bC2BE2d2E279C486662319c';
var key = '97f39a2e47d6c5dd0dde26b835e8db05c9e2b1af786478f5cd18453aa97da48a';
//var key2 = '<KEY>';
var amount = web3.toWei(.0001, "ether");
var balance = web3.eth.getBalance(address);

var value = web3.fromWei(balance, 'ether');

	const gasPrice = web3.eth.gasPrice;
	const gasPriceHex = web3.toHex(gasPrice);
	const gasLimitHex = web3.toHex(3000000);

/*function sendRaw(rawTx) {
    var privateKey = new Buffer(key, 'hex');
    var transaction = new tx(rawTx);
    transaction.sign(key);
    var serializedTx = transaction.serialize().toString('hex');
    web3.eth.sendRawTransaction(
        '0x' + serializedTx, function(err, result) {
            if(err) {
                console.log('error');
                console.log(err);
            } else {
                console.log('success');
                console.log(result);
            }
        });
}*/

/*var rawTx = {
    nonce: web3.toHex(web3.eth.getTransactionCount(address)),
    gasLimit: 2000000,//web3.toHex(21000),
    to: address2,
    from:address,
    value: web3.toHex(web3.toBigNumber(amount))

}*/

var fTx = {
    nonce: web3.toHex(web3.eth.getTransactionCount(address)),
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
   // data: greeter.code,
    from: address,
	to: address2,
	value: web3.toHex(web3.toBigNumber(amount))
};
//web3.setProvider(TestRPC.provider());



const debug = require('debug')('pocexpress-server');




function createTitleTransferTransactionFromCsv(titleTransferCsv){

    var titleTransferTransaction = {};

   // var csvArr = titleTransferCsv.split(',');

    titleTransferTransaction.ttid = titleTransferCsv[0];

    titleTransferTransaction.khasraNo = titleTransferCsv[1];

    titleTransferTransaction.adhaarNo = titleTransferCsv[2];	
	

    debug("titleTransferTransaction -> " + JSON.stringify(titleTransferTransaction));

    return titleTransferTransaction;

}

function createTitleTransferTransactionFromCsv1(titleTransferCsv){

    var titleTransferTransaction = {};

   // var csvArr = titleTransferCsv.split(',');


    titleTransferTransaction.khasraNo = titleTransferCsv[0];

    titleTransferTransaction.adhaarNo = titleTransferCsv[1];	
	

    debug("titleTransferTransaction -> " + JSON.stringify(titleTransferTransaction));

    return titleTransferTransaction;

}






router.post('/create', function(req, res, next) {
	
	debug('balance ->' + balance);
	
	//debug('rawTx ->' + rawTx.value);
	
	//sendRaw(rawTx);

    debug('req.body.name ->' + JSON.stringify(req.body.name));

   // var GreeterClass = this.web3.eth.contract(greeter.abi);

   // var GreeterService = GreeterClass.at(greeter.address);

	var privateKey = new Buffer(key, 'hex');
	var txx = new tx(fTx);
	txx.sign(privateKey);

	var sTx =txx.serialize();

	web3.eth.sendRawTransaction('0x' + sTx.toString('hex'), (err, hash) => {
		if (err) { console.log(err); return; }

		// Log the tx, you can explore status manually with eth.getTransaction()
		console.log('contract creation tx: ' + hash);
	});
   
    //debug("txId -> " + txId);
	 //var status = GreeterService.setGreeting(req.body.name,{ gas: 33482});
	 //debug("status -> " + status);
     //res.json(status);
	 //res.send(res1);
	 

});

router.put('/update/:tttId', function(req, res, next) {

      var TitleRegistryContractClass = this.web3.eth.contract(TitleRegistry.abi);

    var TitleRegistryService = TitleRegistryContractClass.at(TitleRegistry.address);

    var titleTransferInfo =  TitleRegistryService.getTTTAddress(''+req.params.tttId);

    //debug("tttAddress -> " + tttAddress);

    /*if(tttAddress === '0x0000000000000000000000000000000000000000'){

        res.sendStatus(404);

        return;

    }*/

    //var TitleTransferTransactionContractClass = this.web3.eth.contract(TitleTransferTransaction.abi);

    //var TitleTransferTransactionTypeService = TitleTransferTransactionContractClass.at(tttAddress);
	


    var status = TitleRegistryService.updateTitleTransfer(req.params.tttId,req.body.khasraNo,req.body.adhaarNo,{ gas: 46352});

    

    res.json(status);

});



router.get('/titleTransfers/all', function(req, res, next) {

    //debug('req.body.name ->' + JSON.stringify(req.body.name));



    var GreeterClass = this.web3.eth.contract(greeter.abi);

    var GreeterService = GreeterClass.at(greeter.address);

   

     debug('greet -> ' + GreeterService.greet());



   

	

    res.json(GreeterService.greet());

});


router.get('/titleTransfers/tranactions/:tttId', function(req, res, next) {

    var TitleRegistryContractClass = this.web3.eth.contract(TitleRegistry.abi);

    var TitleRegistryService = TitleRegistryContractClass.at(TitleRegistry.address);

    var titleTransferInfo =  TitleRegistryService.getTTTAddress(''+req.params.tttId);
	

   // debug("tttAddress -> " + tttAddress);

    /*if(tttAddress === '0x0000000000000000000000000000000000000000'){

        res.sendStatus(404);

        return;

    }*/
	
	
    /*var TitleTransferTransactionContractClass = this.web3.eth.contract(TitleTransferTransaction.abi);

    var TitleTransferTransactionTypeService = TitleTransferTransactionContractClass.at(tttAddress);

    var titleTransferCsv = TitleTransferTransactionTypeService.toCsv();

    debug("titleTransferCsv -> " + titleTransferCsv);*/

    var titleTransferTransaction = createTitleTransferTransactionFromCsv1(titleTransferInfo);

    res.json(titleTransferTransaction);

    

});



router.get('/titleTransfers/count', function(req, res, next) {

       var TitleRegistryContractClass = this.web3.eth.contract(TitleRegistry.abi);

    var TitleRegistryService = TitleRegistryContractClass.at(TitleRegistry.address);

    var titleRegistryCount =TitleRegistryService.getTTTCount();

    debug("tttCount -> " + titleRegistryCount);

    res.json(titleRegistryCount);

});







/*router.delete('/titleTransfers/delete/:tttId', function(req, res, next) {

    var TitleRegistryContractClass = this.web3.eth.contract(TitleRegistry.abi);

    var TitleRegistryService = TitleRegistryContractClass.at(TitleRegistry.address);

    var tttAddress =  TitleRegistryService.getTTTAddress(''+req.params.tttId);

    debug("tttAddress -> " + tttAddress);

    if(tttAddress === '0x0000000000000000000000000000000000000000'){

        res.sendStatus(404);

        return;

    }
	


    var status = TitleRegistryService.removeTitleTransfer(req.params.tttId,{ gas: 32586});

    

    res.json(status);

    

});*/






module.exports = router;
var express = require('express');

var abi = require('../lib/abi');

var router = express.Router();

var fs = require('fs');

var Web3 = require('web3');



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

    debug('req.body.name ->' + JSON.stringify(req.body.name));



    var TitleRegistryContractClass = this.web3.eth.contract(TitleRegistry.abi);

    var TitleRegistryService = TitleRegistryContractClass.at(TitleRegistry.address);

    var titleRegistryCount =TitleRegistryService.getTTTCount();

     debug('titleRegistryCount -> ' + titleRegistryCount);

    var fullPath = 'D:/Laptop/LiveBiz/embark_demo/app/contracts/TitleTransferTransaction.sol';

    debug('fullPath -> ' + fullPath);

    var sol = fs.readFileSync(fullPath).toString();

   // debug('sol -> ' + sol);





    //debug('source: ' + source);

    var compiled = web3.eth.compile.solidity(sol);

    // debug('compiled: ' + JSON.stringify(compiled));

    //var jsonPath = '<stdin>:TitleTransferTransaction';//+req.body.name;

   // debug('jsonPath: ' + jsonPath);

   // var compiledLegalEntity = compiled[jsonPath];

   // var code = compiled.TitleTransferTransaction.code;

    //var abi = compiled.TitleTransferTransaction.info.abiDefinition;

    //var balance = web3.eth.getBalance(web3.eth.coinbase);

    //debug('Balance ->' + web3.eth.gasPrice);
	


    //var balance =  web3.eth.getBalance(web3.eth.accounts[1]);

   // var contractData = web3.eth.contract(abi);

    //var gasEstimate = web3.eth.estimateGas(contractData);	

    //debug('balance ->' + balance);
	var d = new Date();
	var counter = d.getTime();//parseInt(titleRegistryCount) + 1;
	debug('counter' + counter);
    /*var txId = web3.eth.contract(abi).new(req.body.name,req.body.khasraNo,req.body.adhaarNo, { data: code, gas: 2297528  }, function(err, contract) {

        if (err) {

            

            debug(err);

            res.status(500).send(err);

        }

        else if (contract.address) {

 		debug('contract.address' + contract.address);

		res.status(200).send('success :' + counter);

      }

    });*/
	
	

    //debug("txId -> " + txId);
	 var status = TitleRegistryService.addTitleTransfer(req.body.counter,req.body.khasraNo,req.body.adhaarNo,{ gas: 168552});
	 
     res.json(status);
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

    var titleTransfers = [];

    var TitleRegistryContractClass = this.web3.eth.contract(TitleRegistry.abi);

    var TitleRegistryService = TitleRegistryContractClass.at(TitleRegistry.address);

    var tttCount = TitleRegistryService.getTTTCount();

    debug("tttCount -> " + tttCount);

    for(var i = 0; i < tttCount; i++) {

        debug("i -> " + i);

        var titleTransferInfo =  TitleRegistryService.getTTTInfo(i);

        debug("titleTransferInfo -> " + titleTransferInfo);

       // var TitleTransferTransactionContractClass = this.web3.eth.contract(TitleTransferTransaction.abi);
		
		//debug("TitleTransferTransactionContractClass -> " + TitleTransferTransactionContractClass);
	   
	   
	   //debug("tttAddress -> " + titleTransferInfo[1]);
	   if( titleTransferInfo[1] === '0x0000000000000000000000000000000000000000'){

             

	   }else{
		   //var TitleRegistryService = TitleRegistryContractClass.at(titleTransferInfo[1]);
		   
			
			debug("TitleTransferTransactionTypeService -> " + TitleRegistryService);

			//var titleTransferCsv = TitleRegistryService.toCsv();

			//debug("titleTransferCsv -> " + titleTransferCsv);

			var titleTransferTransaction = createTitleTransferTransactionFromCsv(titleTransferInfo);

			titleTransfers.push(titleTransferTransaction);
	   }

    }

    res.json(titleTransfers);

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
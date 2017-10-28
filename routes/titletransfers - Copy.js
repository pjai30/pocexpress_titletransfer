var express = require('express');

var abi = require('../lib/abi');

var router = express.Router();

var fs = require('fs');

var Web3 = require('web3');
var solc = require('solc');



const debug = require('debug')('pocexpress-server');
//const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8585"));






function createTitleTransferTransactionFromCsv(titleTransferCsv){

    var titleTransferTransaction = {};

    var csvArr = titleTransferCsv.split(',');

    titleTransferTransaction.ttid = csvArr[1];

    titleTransferTransaction.buyer = csvArr[2];

    titleTransferTransaction.seller = csvArr[3];	

    debug("titleTransferTransaction -> " + JSON.stringify(titleTransferTransaction));

    return titleTransferTransaction;

}





router.post('/create', function(req, res, next) {
	


    debug('req.body.name ->' + JSON.stringify(req.body.name));



    var TitleRegistryContractClass = this.web3.eth.contract(TitleRegistry.abi);

    var TitleRegistryService = TitleRegistryContractClass.at(TitleRegistry.address);

    var titleRegistryCount =TitleRegistryService.getTTTCount();

     debug('titleRegistryCount -> ' + titleRegistryCount);

    var fullPath = "D:/Laptop/Goldman Sachs/GS Initiative/Fannie Mae/Code/PocEmbark/app/contracts/TitleTransferTransaction.sol";

    debug('fullPath -> ' + fullPath);

    var sol = fs.readFileSync(fullPath, 'utf8').toString();

  //  debug('sol -> ' + sol);

    var code;
	var abi;


   //debug(web3.eth.getCompilers());


    //debug('source: ' + source);

  // var compiled = web3.eth.compile.solidity(sol);
	
	var compiled = solc.compile(sol, 1);
	debug('compiled: ' + compiled.contracts);
	
	for (var contractName in compiled.contracts){
		//debug(contractName + ': ' + compiled.contracts[contractName].bytecode);
		//if (contractName = 'TitleTransferTransaction'){
			  code = compiled.contracts[contractName].bytecode;
			  abi = compiled.contracts[contractName].interface;
		//}
	}

  // debug('compiled: ' + JSON.stringify(compiled));

   // var jsonPath = "<stdin>:TitleTransferTransaction";//+req.body.name;

  //  debug('jsonPath: ' + jsonPath);

    //var compiledLegalEntity = compiled[jsonPath];
	
	//debug('compiledLegalEntity: ' + compiledLegalEntity);
	
	//var code = compiledLegalEntity.code;

   // var code = compiled.contracts['TitleTransferTransaction'].bytecode;

//   var abi = compiledLegalEntity.info.abiDefinition;
	
//	var abi = compiled.contracts['TitleTransferTransaction'].interface;

   // var balance = web3.eth.getBalance(web3.eth.coinbase);

   // debug('Balance ->' + balance);

    

    //var contractData = web3.eth.contract(abi);

    //var gasEstimate = web3.eth.estimateGas();	

    //debug('gasEstimate ->' + gasEstimate);
	
	var mycontract = web3.eth.contract(JSON.parse(abi));
	debug('mycontract: ' + mycontract.at(TitleRegistry.address).toString('hex'));
	var counter =titleRegistryCount.add(1);
	//debug(TitleRegistry.address);
    var txId = mycontract.new(TitleRegistry.address.toString('hex'),counter.toString(10),'buyer','seller', { data: code, gas: 9999999}, function(err, contract) {
        if (err) {
            debug(err);

            res.status(500).send(err);

        }
        else if (contract.address) {

 		debug('contract.address' + contract.address);

		res.status(200).send('success');

      }

    });

    debug("txId -> " + txId);

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

        var TitleTransferTransactionContractClass = this.web3.eth.contract(TitleTransferTransaction.abi);

        var TitleTransferTransactionTypeService = TitleTransferTransactionContractClass.at(titleTransferInfo[1]);

        var titleTransferCsv = TitleTransferTransactionTypeService.toCsv();

        debug("titleTransferCsv -> " + titleTransferCsv);

        var titleTransferTransaction = createTitleTransferTransactionFromCsv(titleTransferCsv);

        titleTransfers.push(titleTransferTransaction);

    }

    res.json(titleTransfers);

});





router.get('/titleTransfers/count', function(req, res, next) {

    var TitleRegistryContractClass = this.web3.eth.contract(TitleRegistry.abi);

    var TitleRegistryService = TitleRegistryContractClass.at(TitleRegistry.address);

    var tttCount = TitleRegistryService.getTTTCount();

    debug("tttCount -> " + tttCount);

    res.json(tttCount);

});



router.get('/titleTransfers/tranactions/:tttId', function(req, res, next) {

    var TitleRegistryContractClass = this.web3.eth.contract(TitleRegistry.abi);

    var TitleRegistryService = TitleRegistryContractClass.at(TitleRegistry.address);

    var tttAddress =  TitleRegistryService.getTTTAddress(''+req.params.tttId);

    debug("tttAddress -> " + tttAddress);

    if(tttAddress === '0x0000000000000000000000000000000000000000'){

        res.sendStatus(404);

        return;

    }

    var TitleTransferTransactionContractClass = this.web3.eth.contract(TitleTransferTransaction.abi);

    var TitleTransferTransactionTypeService = TitleTransferTransactionContractClass.at(tttAddress);

    var titleTransferCsv = TitleTransferTransactionTypeService.toCsv();

    debug("titleTransferCsv -> " + titleTransferCsv);

    var titleTransferTransaction = createTitleTransferTransactionFromCsv(titleTransferCsv);

    res.json(titleTransferTransaction);

    

});



module.exports = router;
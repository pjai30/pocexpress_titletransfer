var EmbarkJS = {};

EmbarkJS.Contract = function(options) {
  var self = this;
  var i, abiElement;

  this.abi = options.abi;
  this.address = options.address;
  this.code = options.code;
  this.web3 = options.web3 || web3;

  var ContractClass = this.web3.eth.contract(this.abi);

  this.eventList = [];

  if (this.abi) {
    for (i = 0; i < this.abi.length; i++) {
      abiElement = this.abi[i];
      if (abiElement.type === 'event') {
        this.eventList.push(abiElement.name);
      }
    }
  }

  var messageEvents = function() {
    this.cb = function() {};
  };

  messageEvents.prototype.then = function(cb) {
    this.cb = cb;
  };

  messageEvents.prototype.error = function(err) {
    return err;
  };

  this._originalContractObject = ContractClass.at(this.address);
};

module.exports = EmbarkJS;
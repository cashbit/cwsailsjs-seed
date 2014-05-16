module.exports.init = function(){

	function onBooleanMessage(name,value){
	  console.log('Boolean message: ' + name + ' value: ' + value);
	}

	function onStringMessage(name,value){
	  console.log('String message: ' + name + ' value: ' + value);
	}

	function onRangeMessage(name,value){
	  console.log('Range message: ' + name + ' value: ' + value);
	}

	function onCustomMessage(name,value,type){
		var util = require('util') ;
	  console.log('Custom message: ' + name + ' of type: ' + type + ' value: ' + util.inspect(value));
	  if (name === 'itemExploded'){
		GSDStockSimulator.itemExploded(value) ;
	  }
	  if (name === 'itemDescribed'){
		GSDStockSimulator.itemDescribed(value) ;
	  }
	}

	function onOpen(){
	  console.log('open cccc') ;
	}

	var s = require('spacebrew') ;
    var sb = new s.Spacebrew.Client( 'portofino.celeweb.eu', 'gsdStockSimulator', 'GSD Stock simulator 1.0', {reconnect:true} );
    sb.addPublish('explodeItem', 'custom', {});
    sb.addPublish('describeItem', 'custom', {});
    sb.addSubscribe('itemExploded', 'custom');
    sb.addSubscribe('itemDescribed','custom');
    // override Spacebrew events - this is how you catch events coming from Spacebrew
    sb.onBooleanMessage = onBooleanMessage;
    sb.onStringMessage = onStringMessage;
    sb.onRangeMessage = onRangeMessage ;
    sb.onCustomMessage = onCustomMessage ;
    sb.onOpen = onOpen;

    sb.connect();

    return sb ;
};
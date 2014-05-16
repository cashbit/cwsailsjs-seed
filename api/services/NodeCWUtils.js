exports.generateUUID = function(){
    var d = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=="x" ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};
/*
exports.setupPrototypes = function(){

	Number.prototype.formatMoney = function(c, d, t){
		var n = this, 
	    c = isNaN(c = Math.abs(c)) ? 2 : c, 
	    d = d == undefined ? "." : d, 
	    t = t == undefined ? "," : t, 
	    s = n < 0 ? "-" : "", 
	    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
	    j = (j = i.length) > 3 ? j % 3 : 0;
	   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	 };

	Number.prototype.formatNumber = function(c, d, t){
		var n = this, 
	    c = isNaN(c = Math.abs(c)) ? 2 : c, 
	    d = d == undefined ? "," : d, 
	    t = t == undefined ? "." : t, 
	    s = n < 0 ? "-" : "", 
	    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
	    j = (j = i.length) > 3 ? j % 3 : 0;
	   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	};

	Date.prototype.formatDate = function(){
		var outputDateElements = [] ;
		var locale = NodeCWInterfaceUtils.getCurrentLocale() ;
		var dateFormatPositions = locale.dateFormat.split('/') ;	
		for (var i=0;i<dateFormatPositions.length;i++){
			if (dateFormatPositions[i] == 'd'){
				outputDateElements.push(this.getDate()) ;
			}
			if (dateFormatPositions[i] == 'm'){
				outputDateElements.push(this.getMonth()) ;
			}
			if (dateFormatPositions[i] == 'y'){
				outputDateElements.push(this.getFullYear()) ;
			}
		}
		return outputDateElements.join('/') ;
	}
}
*/

exports.iterateFunctionOnElementsWithFinalCallBack = function(elements,iterateFunction,finalCallBack){

	function internalIterateFunction(){
		if (iterateElementIndex >= elements.length){
			finalCallBack();
		} else {
			var element = elements[iterateElementIndex] ;
			iterateElementIndex++ ;
			iterateFunction(element,function(err){
				if (err){
					finalCallBack(err) ;
				} else {
					internalIterateFunction() ;
				}
			}) ;
		}
	}

	var iterateElementIndex = 0 ;
	internalIterateFunction() ;
};

exports.executeFunctionOnElementsWithFinalCallBack = function(elements,iterateFunction,finalCallBack){
	if (elements.length === 0){
		finalCallBack();
	}
	var executeCounter = 0 ;
	var errors = [] ;
	for (var i = 0; i < elements.length; i++){
		var element = elements[i] ;
		iterateFunction(element,function(err){
			if (err){
				errors.push(err) ;
			}
			executeCounter++ ;
			if (executeCounter >= elements.length){
				finalCallBack(errors) ;
			}
		});
	}
} ;
	
exports.makeSelectedOptions = function(relatedItems, selectedItem){
	var options = [] ;
	for (var relatedItem in relatedItems){
		var option = _.clone(relatedItems[relatedItem]);
		if (selectedItem){
			if (relatedItems[relatedItem].id == selectedItem.id){
			  option.selected = "selected";
			} else {
			  option.selected = "" ;
			}
		}
		options.push(option) ;
	}
	return options ;
};

exports.populateDatabaseWithDefaultValues = function(defaultValuesCallBack,witchClass){

	function createObjectQueueFromDefaultValues(defaultValues,witchClass){
		var objectQueue = [] ;
		
		for (var className in defaultValues){
			if (witchClass) {
				if (className != witchClass) {
					sails.log.warn("Skipping:" + className) ;
					continue ;
				}
			}
			var classObjects = defaultValues[className] ;
			if (typeof(classObjects) == "string"){
				var inc = require("./" + classObjects) ;
				classObjects = inc.defaultValues() ;
			}
			for (var id in classObjects){
				var object = classObjects[id] ;
				var objectInClass = {
					className : className,
					object: object
				} ;
				objectQueue.push(objectInClass) ;
			}
		}

		return objectQueue ;
	}

	function createObjectInClassFromQueue(objectInClass,callBack){
		var className = objectInClass.className ;
		var object = objectInClass.object ;

		sails.log.warn("Creating default values in : " + className) ;
		if (object !== undefined){
			// if we have a field like : projecttype.name we want to translate with the id of the record in projecttype with that name
			var objectkeys = [] ;
			for (var fieldName in object){
				objectkeys.push(fieldName) ;
			}
			async.each(
				objectkeys,
				function(key,cb){
					if (key.indexOf(".") > -1){
						var components = key.split(".") ;
						var entityname = components[0] ;
						var fieldname = components[1] ;
						var filter = {} ;
						var str = object[key] ;
						var regex = new RegExp(["^",str,"$"].join(""),"i");
						// Creates a regex of: /^SomeStringToFind$/i
						filter[fieldname] = regex ;
						sails.models[entityname].findOne(filter,function(err,foundRecord){
							if (err) return cb(err) ;
							if (foundRecord) object[entityname] = foundRecord.id ;
							delete object[key] ;
							cb();
						});
					} else {
						cb();
					}
				},
				function(err){
					if (err) return callBack(err) ;
					sails.models[className].create(object,function(err,newobject){
						if (err){
							sails.log.error("Error creating record in '"+className+"' with values: " +util.inspect(newobject)) ;
							throw new Error(err) ;
						} else {
							callBack() ;
						}
					}) ;
				}
			) ;

		} else {
			sails.log.warn("Found undefined object in : " + className) ;
			callBack() ;
		}
	}
	
	var util = require("util") ;

	sails.log.warn("Creating default values...") ;
	var objectQueue = createObjectQueueFromDefaultValues(sails.config.defaultValues,witchClass) ;
	sails.log.warn(util.inspect(objectQueue));
	async.eachLimit(
		objectQueue,
		1,
		createObjectInClassFromQueue,
		function(err){
			defaultValuesCallBack(err);
		}
	) ;
};
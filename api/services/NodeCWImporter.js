exports.insertIfNotExists = function(record,className,keyField,callBackInsertUpdate){
	var whereCriteria = {} ;
	whereCriteria[keyField] = record[keyField] ;
	sails.models[className].findOne(whereCriteria).exec(function(err,foundRecord){
		if (err){
			callBackInsertUpdate(err,record) ;
		} else {
			if (!foundRecord){
				sails.models[className].create(record,function(err,createdRecord){
					callBackInsertUpdate(err,createdRecord) ;	
				})
			} else {
				callBackInsertUpdate(err,record) ;
			}
		}
	})
}

exports.importRecordsInClassWithKeyFieldFromArray = function(records,className,keyFieldName,importRecordsFromArrayCallBack){
	NodeCWUtils.iterateFunctionOnElementsWithFinalCallBack(
		record,
		function(record,callBack){
			NodeCWImporter.insertIfNotExists(record,className,keyFieldName,callBack) ;	
		},
		function(err){
			importRecordsFromArrayCallBack(err) ;
		}
	)
}


exports.readArrayFromCSVFile = function(fileName, rowSeparator, fieldSeparator, fieldNamesInFirstRow, readArrayFromCSVFileCallBack ){
	var fs = require('fs') ;
	var output = [] ;
	fs.readFile(fileName, function read(err, data) {
	    
	    if (err) {
	        readArrayFromCSVFileCallBack(err,output) ;
	        return ;
	    }

	    var fieldNames = [] ;
	    var rows = data.split(rowSeparator) ;
	    for (var i=0;i<rows.length;i++){
	    	var row = rows[i] ;
	    	var fieldValues = row.split(fieldSeparator) ;
	    	if (i==0){
	    		if (fieldNamesInFirstRow) {
	    			fieldNames = fieldValues ;
	    		}
	    	} else {
	    		var record = {} ;
	    		for (var ii=0;ii<fieldNames.length;ii++){
	    			var fieldName = fieldNames[i] ;
	    			var fieldValue = fieldValues[i] ;
	    			record[fieldName] = fieldValue ;
	    		}
	    		output.push(record) ;
	    	}
	    }
	    
	    readArrayFromCSVFileCallBack(err,output) ;
	});
}

exports.importCSVFileInClassWithKeyField = function(fielName,rowSeparator,fieldSeparator,fieldNamesInFirstRow,className,keyfieldName,importCSVFileInClassWithKeyFieldCallBack){
	NodeCWImporter.readArrayFromCSVFile(fileName,rowSeparator,fieldSeparator,fieldNamesInFirstRow,function(err,records){
		if (err){
			importCSVFileInClassWithKeyFieldCallBack(err) ;
		} else {
			NodeCWImporter.importRecordsInClassWithKeyFieldFromArray(records,className,keyfieldName,function(err){
				importCSVFileInClassWithKeyFieldCallBack(err) ;
			})	
		}
	})
}


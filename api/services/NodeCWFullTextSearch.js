exports.fullTextSearch = function(req,searchText,fullSearchCallBack){

	var searchTextSplit = "" ;
	var classNameSplit = false;

	function splitSearchText(){
		var components = searchText.split("/") ;
		if (components.length == 2){
			classNameSplit = components[0] ;
			searchTextSplit = components[1] ;
		} else {
			searchTextSplit = components[0] ;
		}
	}

	function compileWhere(searchField){
		var searchCriteria = {} ;
		searchCriteria[searchField] = { contains: searchTextSplit} ;
		return {where : searchCriteria}
	}

	function searchEntity(searchEntityConfig,searchCallBack){
	
		if (classNameSplit){
			if (searchEntityConfig.entity != classNameSplit){
				searchCallBack() ;
				return ;
			}
		}

		var group = req.session.User.group ;
		if (searchEntityConfig.groups){
			if (!searchEntityConfig.groups[group]){
				searchCallBack() ;
				return ;
			}
		}
	
		var where = compileWhere(searchEntityConfig.searchField) ;
		sails.models[searchEntityConfig.entity].find(where).done(function(err,records){
	  		for (var el in records){
	  			var record = records[el] ;
	  			searchResults.push({
	  				id: 		record.id,
	  				title: 		record[searchEntityConfig.titleField], 
	  				subTitle: 	record[searchEntityConfig.subTitleField],
	  				entity: 	searchEntityConfig.entity
	  			})
	  		}
	  		searchCallBack();				
		})
	}

	function distinct(){
		var map = {} ;
		var distinctResult = [] ;
		for (var el in searchResults){
			var searchResult = searchResults[el] ;
			if (!map[searchResult.entity]){
				map[searchResult.entity] = {} ;
			}
			if (!map[searchResult.entity][searchResult.id]){
				map[searchResult.entity][searchResult.id] = true ;
				distinctResult.push(searchResult) ;
			}
		}
		return distinctResult ;
	}

	var searchResults = [] ;
	splitSearchText();
	NodeCWUtils.iterateFunctionOnElementsWithFinalCallBack(
		sails.config.searchConfig,
		searchEntity,
		function(err){
			fullSearchCallBack(distinct(searchResults)) ;
		}
	)
}
module.exports.loadWorkFlow = function(){

	var workflow ;
	var filepath = __dirname + '/WorkFlowConfig.js' ;
	var fs = require('fs') ;
	if (fs.existsSync(filepath)){
	  var fromFileString = fs.readFileSync(filepath) ;
	  var dataString = fromFileString.toString().replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '$1');
	  if (dataString){
	    workflow = JSON.parse(dataString) ;
	  }
	}

	return workflow ;
};

module.exports.workflow = function(name){

	var workflow = module.exports.loadWorkFlow() ;

	return workflow[name] ;

 };

module.exports.getNextActiveStep = function(req){
	if (req.session.workflowActiveStep === 'undefined') req.session.workflowActiveStep = -1 ;
	req.session.workflowActiveStep++ ;
	return req.session.workflow.steps[req.session.workflowActiveStep] ;
};

module.exports.index = function(req,res){
	var workflows = module.exports.loadWorkFlow() ;
	res.view({workflows:workflows}) ;
};

module.exports.start = function(req,res,next){
	req.session.workflowActiveStep = -1 ;
	var workflowName = req.param('workflowname') ;
	req.session.activeWorkFlowName = workflowName ;
	var workflow = module.exports.workflow(workflowName) ;
	if (workflow){
		req.session.workflow = workflow ;
		var activeStep = module.exports.getNextActiveStep(req) ;
		res.redirect(activeStep.url) ;
	} else {
		next();
	}
};

module.exports.next = function(req,res,next){
	var workflow = module.exports.workflow(req.session.activeWorkFlowName) ;
	if (workflow){
		req.session.workflow = workflow ;
		var activeStep = module.exports.getNextActiveStep(req) ;
		res.redirect(activeStep.url) ;
	} else {
		next();
	}
};

module.exports.end = function(req,res){
	var finalUrl = req.session.workflow.finalUrl + '' ;
	delete req.session.activeWorkFlowName ;
	delete req.session.workflow ;
	delete req.session.workflowActiveStep ;
	res.redirect(finalUrl) ;

};
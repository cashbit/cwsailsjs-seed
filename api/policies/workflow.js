module.exports = function(req, res, next) {
	if (req.session.workflow){
		for (var i=0;i<req.session.workflow.steps.length;i++){
			var step = req.session.workflow.steps[i] ;
			if (req._parsedUrl.pathname.indexOf(step.pathname) === 0){
				req.session.workflowActiveStep = i ;
			}
		}
	}
	next();
};
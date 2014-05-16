/**
 * Allow any authenticated user.
 */
module.exports = function(req, res, ok) {

  // User is allowed, proceed to controller
  // sails.log.debug("Policy Authenticated...");
  // sails.log.debug(req.session.User) ;
  
  var controller = req.target.controller;
  
  
  if (req.session.User) {
    if(req.session.flash){
       res.locals.flash = _.clone(req.session.flash);
    } else {
       // clear flash
      req.session.flash = {};
      res.locals.flash = {} ;
    }
    return ok();
  }

  // User is not allowed
  else {
    var requireLoginError = [{name: 'requireLogin', message: 'You must be signed in.'}]
    req.session.flash = {
     	err: requireLoginError
    }
    
    
    if (controller.indexOf('b2b') > -1) {
	    res.redirect('/gsdb2bLogin');
	} else {
		res.redirect('/session/new');	
	}
    
    
    return;
    //res.send(403);
  }
  
  
};
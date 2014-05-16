/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {

	var controller = req.target.controller;

  // User is allowed, proceed to controller
  if ((req.session.User && req.session.User.admin) || controller == 'gsdb2bportal' || controller == 'b2blogin') {
    return ok();
  }

  // User is not allowed
  else {
  	var requireAdminError = [{name: 'requireAdminError', message: 'You must be an admin.'}]
		req.session.flash = {
			err: requireAdminError
		}
    if (controller.indexOf('b2b') > -1) {
	    res.redirect('/gsdb2bLogin');
	} else {
		res.redirect('/session/new');	
	}
    return;
  }
    
};
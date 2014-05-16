/**
 * SessionController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  'new': function(req, res) {
		res.view('session/new');
	},

	create: function(req, res, next) {

		if (!req.param('email') || !req.param('password')) {
			var usernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message: 'You must enter both a username and password.'}]
				req.session.flash = {
					err: usernamePasswordRequiredError
			}
			res.redirect('/session/new');
			return;
		}

		User.findOneByEmail(req.param('email'), function foundUser (err, user) {
			if (err) return next(err);
			if (!user) {
				var noAccountError = [{name: 'noAccount', message: 'The email address ' + req.param('email') + ' not found.'}]
				req.session.flash = {
					err: noAccountError	
				}
				res.redirect('/session/new');
				return;
			}
			var crypto = require('crypto');
		    var shasum = crypto.createHash('sha1');
		    shasum.update(req.param('password'));
		    if (user.encryptedPassword != shasum.digest('hex')){
		    	var usernamePasswordMismatchError = [{name: 'usernamePasswordMismatch', message: 'Invalid username and password combination.'}]
				req.session.flash = {
					err: usernamePasswordMismatchError
				}
				res.redirect('/session/new');
				return;
		    } else {
				req.session.authenticated = true;
				req.session.User = user;
				req.session.UserGroupConfig = sails.config.userGroups[user.group] || {home:''} ;
				user.online = true;
				user.save(function(err, user) {
					if (err) return next(err);
					User.publishUpdate(user.id, {
						loggedIn: true,
						id: user.id,
						name: user.name,
						action: ' has logged in.'
					});

					res.redirect('/'+req.session.UserGroupConfig.home);				
				});	
		    };
		});
	},
	
	

	destroy: function(req, res, next) {
		if (!req.session.User) {
			req.session.destroy();
			return res.redirect('/session/new') ;
		}
		User.findOne(req.session.User.id, function foundUser (err, user) {
			if (!user) {
				req.session.destroy();
				return res.redirect('/session/new') ;
			}

			var userId = req.session.User.id;

			// The user is "logging out" (e.g. destroying the session) so change the online attribute to false.
			User.update(userId, {
				online: false
			}, function (err) {
				if (err) return next(err);

				// Inform other sockets (e.g. connected sockets that are subscribed) that the session for this user has ended.
				User.publishUpdate(userId, {
					loggedIn: false,
					id: userId,
					name: user.name,
					action: ' has logged out.'
				});

				// Wipe out the session (log out)
				req.session.destroy();

				// Redirect the browser to the sign-in screen
				res.redirect('/session/new');
			});
		});
	}
};

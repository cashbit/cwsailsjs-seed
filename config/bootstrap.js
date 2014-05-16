/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function(cb) {

	// It's very important to trigger this callack method when you are finished 
	// with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)


	//NodeCWUtils.setupPrototypes();
	
	User.find().done(function(err,users){
		if (users.length === 0){
			var userObj = {
				name: 'admin',
				title: 'mr',
				email: 'admin@admin.it',
				password: 'admin',
				confirmation: 'admin',
				group: 'admin',
				admin : true
			};
			User.create(userObj,function(err){
				if (err) return cb(err) ;
				NodeCWUtils.populateDatabaseWithDefaultValues(function(err){
					cb(err);
				}) ;
			});
		} else {
			cb();
			/*
			User.update({}, {
				online: false
			},
			function userUpdated(err, users) {
				if (err) {
					console.log(err);
				} else {
					// console.log(users);
				}
				cb();
			})
			*/
		}
	});

	//global.spacebrew = SpaceBrew.init();

};
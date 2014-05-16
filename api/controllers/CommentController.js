/**
 * CommentController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to CommentController)
   */
  _config: {},

  add: function(req,res,next){
	var commentObj = {
		message : req.param('message'),
		topicUrl : req.param('topicUrl'),
		author: req.session.User.id
	} ;
	Comment.create(commentObj,function(err,createdComment){
		if (err) return next(err) ;
		User.findOne(createdComment.author,function(err,foundUser){
			if (foundUser) createdComment.authorName = foundUser.name ;
			Comment.publishCreate(createdComment.toJSON()) ;
			res.json({
			      success: !err,
			      comment: createdComment
			});
		});
	});
  },

  index: function(req,res){
	Comment.subscribe(req.socket) ;
	Comment.find({topicUrl:req.param('topicUrl')},function(err,foundComments){
		async.each(
			foundComments,
			function(comment,cb){
				User.findOne(comment.author,function(err,foundUser){
					if (foundUser) comment.authorName = foundUser.name ;
					cb(err) ;
				}) ;
			},
			function(err){
				res.json({
					success: !err,
					comments: foundComments
				}) ;
			}
		) ;
	}) ;
  }
};

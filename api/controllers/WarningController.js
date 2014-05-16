/**
 * WarningController
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
   * (specific to WarningController)
   */
  _config: {},

  count:function (req,res,next){
    if (!req.session.User){
      res.json({warningCount:0}) ;
    } else {
      var user = req.session.User.id ;
      Warning.find({readed:false,user:user},function(err,foundedWarnings){
        if (err) return next() ;
        res.json({warningCount:foundedWarnings.length});
      }) ;
    }
  },

  index:function(req,res,next){
    if (!req.session.User){
      res.json({records:[]}) ;
    } else {
      var user = req.session.User.id ;
      Warning.find({readed:false,user:user},function(err,foundedWarnings){
        if (err) return next() ;
        res.view({records:foundedWarnings});
      }) ;
    }
  },

  setReaded: function(req,res,next){
    if (!req.session.User){
      res.redirect('/warning/index') ;
    } else {
      var user = req.session.User.id ;
      Warning.update({id:req.param('id'),user:user},{readed:true, readedby:req.session.User.id},function(err){
        if (err) return next() ;
        res.redirect('/warning/index') ;
      }) ;
    }
  },

  subscribe: function(req, res) {
 
    // Find all current users in the user model
    Warning.find(function foundUsers(err, warnings) {
      if (err) return next(err);
 
      // subscribe this socket to the User model classroom
      Warning.subscribe(req.socket);
 
      // subscribe this socket to the user instance rooms
      Warning.subscribe(req.socket, warnings);
 
      // This will avoid a warning from the socket for trying to render
      // html over the socket.
      res.send(200);
    });
  }
}
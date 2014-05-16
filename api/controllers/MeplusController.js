/**
 * MeplusController
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
   * (specific to MeplusController)
   */
  _config: {},

  show: function(req, res, next) {
          Meplus.find({user : req.session.User.id, readed:false},function(err,mepluses){
            res.view({
              mepluses : mepluses
            });
          });
  },

  add: function (req,res,next){
  	var meplusobj = {
  		url: req.param('url'),
  		title: req.param('title'),
  		readed: false,
  		user: req.session.User.id
  	}
  	Meplus.create(meplusobj,function(err,newMeplusObj){
  		if (err){
  			res.json(err) ;
  		} else {
  			Meplus.find({},function(err,mepluses){
  				res.json({mepluses:mepluses.length}) ;
  			})
  		}
  	})
  },

  count: function(req,res,next){
    if (req.session.User){
      Meplus.find({user : req.session.User.id, readed:false},function(err,mepluses){
        res.json({meplusCount:mepluses.length}) ;
      })    
    } else {
      res.json({error:"no user authenticated"})
    }

  },

  setReaded: function(req,res,next){
  	Meplus.findOne({id:req.param('id')},function(err,meplus){
  		if (err) return next(err);
  		if (!meplus) return next('Meplus doesn\'t exist.');
  		Meplus.update({id:req.param('id')},{readed:true},function(err,updatedMepluses){
  			if (err) return next(err);
  			res.redirect('/meplus/show/' + req.session.User.id); 
  		})
  	})
  },

  save: function(req,res,next){
  	Meplus.findOne({id:req.param('id')},function(err,meplus){
  		if (err) return next(err);
  		if (!meplus) return next('Meplus doesn\'t exist.');
  		Meplus.update({id:req.param('id')},{notes:req.param('notes')},function(err,updatedMepluses){
  			if (err) return next(err);
  			res.redirect('/meplus/show/' + req.session.User.id); 
  		})
  	})
  },

  setReadedAndGoto: function(req,res,next){
  	Meplus.findOne({id:req.param('id')},function(err,meplus){
  		if (err) return next(err);
  		Meplus.update({id:req.param('id')},{readed:true},function(err,updatedMepluses){
  			if (err) return next(err);
  			res.redirect(updatedMepluses[0].url) ;
  		})
  	})
  },

  destroyUI: function(req, res, next) {
    Meplus.findOne(req.param('id'), function (err, record) {
      if (err) return next(err);
      if (!record) return next('Meplus doesn\'t exist.');
      Meplus.destroy(req.param('id'), function (err) {
        if (err) return next(err);
      });        
      res.redirect('/meplus/show/' + req.session.User.id); 
    });
  }
  
};

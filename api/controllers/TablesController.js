/**
 * TablesController
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
   * (specific to MenuController)
   */
  _config: {},



  index: function(req,res,next){

    var populatedMenuEntities = {} ;

    function loadEntity(entity,callback){
      sails.models[entity.model].find(entity.filter).done(function(err,elements){
        if (err) return callback(err) ;
        elements.sort(function(a,b){
          return a[menuConfig.sortAttribute].toString() < b[menuConfig.sortAttribute].toString() ;
        });
        populatedMenuEntities[entity.controller] = Array() ;
        var maxElements = elements.length ;
        if (maxElements > menuConfig.maxItems) maxElements = menuConfig.maxItems ;
        for (ii=0;ii<maxElements;ii++){
          populatedMenuEntities[entity.controller].push(elements[ii]) ;
        }
        callback();
      });
    }

    var menuConfig = sails.config.menuConfig[req.session.User.group] ;
    var menuEntities = [] ;
    for (var r=0;r<menuConfig.menuEntities.length;r++){
      var row = menuConfig.menuEntities[r] ;
      for (var c=0;c<row.length;c++){
        var menuEntity = row[c] ;
        if (typeof(menuEntity) === 'string'){
          menuEntities.push({model:menuEntity,controller:menuEntity,filter:{}}) ;
        } else {
          menuEntities.push({model:menuEntity.model,controller:menuEntity.controller, filter: menuEntity.filter || {} }) ;
        }
      }
    }

    async.each(menuEntities,loadEntity,function(err){
      if (err) return next(err);
      res.view({
        config: menuConfig,
        populatedMenuEntities: populatedMenuEntities
      }) ;
    });

  }
};
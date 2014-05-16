/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */
module.exports = {

  // This loads the sign-up page --> new.ejs
  'new': function(req, res) {
    var userGroups = [] ;
    for (var group in sails.config.userGroups){
      userGroups.push(group) ;
    }
    Country.find(function(err,countries){
      res.view({
        countries : countries,
        userGroups : userGroups
      });     
    })
  },

  'signup': function(req, res) {
    res.view();
  },

  create: function(req, res, next) {

    var userObj = {
      name: req.param('name'),
      title: req.param('title'),
      email: req.param('email'),
      password: req.param('password'),
      confirmation: req.param('confirmation')
    }

    User.create(userObj, function userCreated(err, user) {
      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        }
        return res.redirect('/user/new');
      }
      user.save(function(err, user) {
        if (err) return next(err);
        res.redirect('/user/show/' + user.id); 
      });
    });

  },

  signupCreate: function(req, res, next) {

    var userObj = {
      name: req.param('name'),
      title: req.param('title'),
      email: req.param('email'),
      password: req.param('password'),
      confirmation: req.param('confirmation')
    }

    // Create a User with the params sent from 
    // the sign-up form --> new.ejs
    User.create(userObj, function userCreated(err, user) {

      // // If there's an error
      // if (err) return next(err);

      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        }

        // If error redirect back to sign-up page
        return res.redirect('/user/signup');
      }

      // Log user in
      req.session.authenticated = true;
      req.session.User = user;

      // Change status to online
      user.online = true;
      user.save(function(err, user) {
        if (err) return next(err);

      // add the action attribute to the user object for the flash message.
      user.action = " signed-up and logged-in."

      // Let other subscribed sockets know that the user was created.
      User.publishCreate(user);

        // After successfully creating the user
        // redirect to the show action
        // From ep1-6: //res.json(user); 

        res.redirect('/user/show/' + user.id);
      });
    });
  },

  // render the profile view (e.g. /views/show.ejs)
  show: function(req, res, next) {
    User
      .findOne(req.param('id'))
      .populate("country")
      .exec(
        function foundUser(err, user) {
          if (err) return next(err);
          if (!user) return next();
          if (!user.country) user.country = {country:"none"} ;
          Meplus.find({user : req.session.User.id, readed:false},function(err,mepluses){
            res.view({
              record: user,
              mepluses : mepluses
            });
          })
        });
  },

  index: function(req, res, next) {

    // Get an array of all users in the User collection(e.g. table)
    User.find(function foundUsers(err, users) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view({
        users: users
      });
    });
  },

  // render the edit view (e.g. /views/edit.ejs)
  edit: function(req, res, next) {

    var userGroups = [] ;
    for (var group in sails.config.userGroups){
      userGroups.push(group) ;
    }

    // Find the user from the id passed in via params
    User.findOne(req.param('id'))
      .populate("country")
      .exec(function foundUser(err, user) {
        if (err) return next(err);
        if (!user) return next('User doesn\'t exist.');
        Country.find(function(err,countries){
          var countryOptions = NodeCWUtils.makeSelectedOptions(countries,user.country) ;
          res.view({
            user: user,
            countries : countryOptions,
            userGroups : userGroups
          });     
        })
      });
  },

  // process the info from edit view
  update: function(req, res, next) {

    if (req.session.User.admin) {
      var userObj = {
        name: req.param('name'),
        title: req.param('title'),
        email: req.param('email'),
        country : req.param('country'),
        admin: req.param('admin'),
        group: req.param('group')
      }
    } else {
      var userObj = {
        name: req.param('name'),
        title: req.param('title'),
        email: req.param('email'),
        country : req.param('country')
      }
    }

    if (req.param('password') !== 'undefined'){
      userObj.password = req.param('password') ;
      userObj.confirmation = req.param('confirmation') ;
    }
   


    User.update(req.param('id'), userObj, function userUpdated(err) {
      if (err) {
        return res.redirect('/user/edit/' + req.param('id'));
      }

      res.redirect('/user/show/' + req.param('id'));
    });
  },

  destroy: function(req, res, next) {

    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);

      if (!user) return next('User doesn\'t exist.');

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) return next(err);

        // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
        User.publishUpdate(user.id, {
          name: user.name,
          action: ' has been destroyed.'
        });

        // Let other sockets know that the user instance was destroyed.
        User.publishDestroy(user.id);

      });        

      res.redirect('/user');

    });
  },

  // This action works with app.js socket.get('/user/subscribe') to
  // subscribe to the User model classroom and instances of the user
  // model
  subscribe: function(req, res) {
 
    // Find all current users in the user model
    User.find(function foundUsers(err, users) {
      if (err) return next(err);
 
      // subscribe this socket to the User model classroom
      User.subscribe(req.socket);
 
      // subscribe this socket to the user instance rooms
      User.subscribe(req.socket, users);
 
      // This will avoid a warning from the socket for trying to render
      // html over the socket.
      res.send(200);
    });
  }

};
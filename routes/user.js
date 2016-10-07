// handles routes for signup, signin, profile, and logout
var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConfig = require('../config/passport');

// for login, we use var 'message' here
router.get('/login', function(request, response) {
  if (request.user) return response.redirect('/');
  response.render('accounts/login', { message: request.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: 'login',
  failureFlash: true
}));

// for profile
router.get('/profile', function(request, response, nextcall) {
  User.findOne({ _id: request.user._id }, function(err, user) {
    if (err) return nextcall(err);
    response.render('accounts/profile', { user: user });
  });
});


// for signup, we use var 'errors' here
router.get('/signup', function(request, response, nextcall) {
  response.render('accounts/signup', {
    errors: request.flash('errors')
  });
});

router.post('/signup', function(request, response, nextcall) {
  var user = new User();

    user.profile.name = request.body.name;
    user.password = request.body.password;
    user.email = request.body.email;

    User.findOne({ email: request.body.email }, function(err, existingUser) {
      if (existingUser) {
        // console.log(request.body.email + " is already registered. Try another one.");
        request.flash('errors', 'that email already exists. check your email and try again.');
        return response.redirect('/signup');
      } else {
        user.save(function(err, user) {
          if (err) return nextcall(err);
          // response.json("A new user has been created.");
          return response.redirect('/');
        });
      }
    });
});

module.exports = router;

// from server.js, change 'app' to 'router', recode

// app.post('/create-user', function(request, response, nextcall) {
//   var user = new User();
//
//   user.profile.name = request.body.name;
//   user.password = request.body.password;
//   user.email = request.body.email;
//
//   user.save(function(err) {
//     if (err) return nextcall(err);
//     response.json("Successfully created a new user.");
//   });
// });

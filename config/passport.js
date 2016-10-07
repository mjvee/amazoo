var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// 1st serialize and deserialize
passport.serializeUser(function(user, nextcall) {
  nextcall(null, user._id);
});

passport.deserializeUser(function(id, nextcall) {
  User.findById(id, function(err, user) {
    nextcall(err, user);
  });
});


// 2nd middleware
passport.use('local-login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(request, email, password, nextcall) {
  User.findOne({ email: email}, function(err, user) {
    if (err) return nextcall(err);

    if (!user) {
      return nextcall(null, false, request.flash('loginMessage', 'sorry, no user found.'));
    }
    if (!user.comparePassword(password)) {
      return nextcall(null, false, request.flash('loginMessage', 'sorry, wrong password.'));
    }
    return nextcall(null, user);
  });
}));


// 3rd custom function to validate
exports.isAuthenticated = function(request, response, nextcall) {
  if (request.isAuthenticated()) {
    return nextcall();
  }
  response.redirect('/login');
}

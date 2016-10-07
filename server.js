var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose'); // for db
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejsMate = require('ejs-mate');
// for signup
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var sessionStore = require('connect-mongo')(session);
var passport = require('passport');

var secret = require('./config/secret');
var User = require('./models/user');

var app = express();

// connect to mongodb database
mongoose.connect(secret.database, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("You are now connected to mongolab.com database ...");
  }
});

// middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// for signup
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretkey,
  store: new sessionStore({ url: secret.database, autoconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


/* -- to check cookie, add below the 'middleware',
      before 'routes', and after 'cookieParser' & 'session'
app.get("/*", function(request, response, nextcall) {
  if (typeof request.cookies['connect.sid'] !== 'undefined') {
    console.log(request.cookies['connect.sid']);
  }
  nextcall();
})
*/

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// add this in middleware
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);


// test in browser,uses json data
// app.get('/', function(request, response) {
//   response.json("Great! You are now mastering NodeJS BongV.")
// })


// shows in command prompt
app.listen(secret.port, function(err) {
  if (err) throw err;
  console.log("NodeJS Server is running at port " + secret.port);

});

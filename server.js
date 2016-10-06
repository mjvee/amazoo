var express = require('express');
var morgan = require('morgan');

var app = express();

// middleware
app.use(morgan('dev'));

// in browser,uses json data
app.get('/', function(request, response) {
  response.json("Great! You are now mastering NodeJS BongV.")
})

// shows in command prompt
app.listen(3000, function(err) {
  if (err) throw err;
  console.log("NodeJS Server is running at port 3000 ...");

});

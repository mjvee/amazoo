// handles routes for home, product, cart, and search
var router = require('express').Router();

// from server.js, change 'app' to 'router'
router.get('/', function(request, response) {
  response.render('main/home');
});

router.get('/about', function(request, response) {
  response.render('main/about');
});

module.exports = router;

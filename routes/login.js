var express = require('express');
var passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login', { title: 'Login' });
});

router.post('/', passport.authenticate('local'), function(req, res) {
  res.redirect('../');
});

module.exports = router;

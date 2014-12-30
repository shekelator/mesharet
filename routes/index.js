var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
//passport.authenticate('local'), 
router.get('/', function(req, res) {
  res.render('index', { title: 'Mesharet' });
});

module.exports = router;

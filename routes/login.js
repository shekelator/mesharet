var express = require('express');
var passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

  res.render('login', { title: 'Login', failed: req.query.failed });
});

router.post('/', passport.authenticate('local', 
  { successRedirect: '/',
    failureRedirect: '/login?failed=true',
    failureFlash: "Login failure" })
);

module.exports = router;

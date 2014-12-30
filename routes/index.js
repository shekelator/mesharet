module.exports = function(express, passport) {

  var router = express.Router();

  /* GET home page. */
  router.get('/', isLoggedIn,
    function(req, res) {
      res.render('index', { title: 'Mesharet' });
  });

  return router;
};

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();

  console.log('Not authenticated, redirecting...')
  res.redirect('/login');
}


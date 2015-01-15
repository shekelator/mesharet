var Responsibility = require('../responsibility');
var serviceRepository = require('../serviceRepo');

module.exports = function(express, passport) {

  var router = express.Router();

  /* GET home page. */
  router.get('/', isLoggedIn, function(req, res) {
    serviceRepository.getServices(function(err, services) {
      if(err){
        // throw 500 response
      }

      res.render('signup', { title: 'Sign Up', failed: req.query.failed, services: services });
    });
  });

  router.post('/', isLoggedIn, function(req, res) {
    var svc = serviceRepository.getService(moment(req.body['date']).toJSON(), function(service) {
      service.addResponsibility(req.body['type'], req.body['detail']);
      res.render('signup', { title: 'Sign Up'});
    });
    
    console.log("Retrieved json for date: " + req.body["date"]);
  });

  return router;
};


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();

  console.log('Not authenticated, redirecting...')
  res.redirect('/login');
}

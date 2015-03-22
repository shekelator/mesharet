var serviceRepository = require('../serviceRepo');
var _ = require('lodash');
var moment = require('moment');

module.exports = function(express, passport) {

  var router = express.Router();

  /* GET home page. */
  router.get('/', isLoggedIn, function(req, res) {
    serviceRepository.getServices(function(err, services) {
      if(err){
        // throw 500 response
      }

      var servicesToDisplay = _(services)
        .sortBy(function(s) {
          return s.date.unix();
        })
        .map(function(s) {
          return s.display();
        })
        .value();

      res.render('signup', { title: 'Sign Up', failed: req.query.failed, services: servicesToDisplay, user: req.user });
    });
  });

  router.post('/:serviceId/:responsibilityType', isLoggedIn, function(req, res) {
    var serviceId = req.params.serviceId;
    var responsibilityType = req.params.responsibilityType;

    var service = serviceRepository.getServiceById(serviceId, function(err, service) {
      service.signUp(responsibilityType, req.user.id);

      serviceRepository.update(service, function(err, updatedService) {
        if(err) {
          return res.status(500).send(err);
        }

        res.redirect("/signup");
        /*
        serviceRepository.getServices(function(err, services) {
          if(err) {
            return res.status(500).send(err);
          }

          var sortedServices = _.sortBy(services, function(s) {
            return s.date.unix();
          });

          var servicesToDisplay = _.map(sortedServices, function(s) {
            return s.display();
          });

          res.render('signup', { title: 'Sign Up', services: servicesToDisplay, user: req.user});
        });
*/
      });
    });
  });

  router.post('/', isLoggedIn, function(req, res) {
    var svc = serviceRepository.getService(moment(req.body['date']).toJSON(), function(err, service) {
      if(err) {
        return res.status(500).send(err);
      }

      service.addResponsibility(req.body['type'], req.body['detail']);

      serviceRepository.update(service, function(err, updatedService) {
        if(err) {
          return res.status(500).send(err);
        }

        serviceRepository.getServices(function(err, services) {
          if(err) {
            return res.status(500).send(err);
          }

          var sortedServices = _.sortBy(services, function(s) {
            return s.date.unix();
          });

          var servicesToDisplay = _.map(sortedServices, function(s) {
            return s.display();
          });

          res.render('signup', { title: 'Sign Up', services: servicesToDisplay});
        });
      });
    });

    console.log("Retrieved json for date: " + req.body["date"]);
  });

  return router;
};

// TODO use this
function displayServicesCallback(err, res) {
  serviceRepository.getServices(function(err, services) {
    if(err) {
      return res.status(500).send(err);
    }

    var sortedServices = _.sortBy(services, function(s) {
      return s.date.unix();
    });

    var servicesToDisplay = _.map(sortedServices, function(s) {
      return s.display();
    });

    res.render('signup', { title: 'Sign Up', services: servicesToDisplay});
  });
}

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();

  console.log('Not authenticated, redirecting...')
  res.redirect('/login');
}

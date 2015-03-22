var serviceRepository = require('./serviceRepo');
var Service = require('./service');
var request = require("request");
var moment = require("moment");
var _ = require("lodash");
var async = require('async');

var minimumNumberInThisYearToReturn = 10;

var itemFilter = function(item) {
  var type = item.category === "parashat" ? "shabbat" : "holiday";

  return {
    "date": item.date,
    "type": type,
    "title": item.title,
    "leyning": item.leyning
  };
}

var getShabbatot = function(date, callback) {
    var effectiveDate;
    if(typeof date === "function" && !callback) {
      callback = date;
      effectiveDate = moment();
    } else {
      effectiveDate = moment(date);
    }

    var year = moment(effectiveDate).year();
    var url = "http://www.hebcal.com/hebcal/?v=1&cfg=json&nh=on&ss=on&s=on&i=off&lg=s&year=";
    request(url + year, {json: true}, function(error, response, body) {
      if(!error && response.statusCode !== 200) {
        callback(new Error("Got status code of " + response.statusCode)); 
      }

      var itemsAfterEffectiveDate = _.filter(body.items, function(item) {
        return moment(item.date).isAfter(effectiveDate);
      });

      if(itemsAfterEffectiveDate.length < minimumNumberInThisYearToReturn) {
        request(url + (year + 1), {json: true}, function(err, resp, secondBody) {
          if(!err && resp.statusCode !== 200) {
            callback(new Error("Got status code of " + resp.statusCode)); 
          }

          var result = _.union(body.items, secondBody.items);
          callback(error, _.map(result, itemFilter));
        });
      } else {
        callback(error, _.map(itemsAfterEffectiveDate, itemFilter));
      }
    });
  };

var translateHebcalLeyningToResponsibility = function(detail, key) {
  var mapping = {
    "torah": 1,
    "maftir": 2,
    "haftarah": 3
  };

  return { "type": mapping[key], "detail": detail };
};

var getServices = function() {
  getShabbatot("2015-01-07", function(err, shabbatot) {
    var shabbatotFiltered = _.filter(shabbatot, function(hebCalEntry) {
      // Filter out chol hamo'ed days that are not holidays
      return !(hebCalEntry["title"].indexOf("(CH''M)") >= 0);
    });

    async.each(shabbatotFiltered, function(item) {
      var serviceToCreate = new Service(item.date, item.title);

      var responsibilities = _.map(item.leyning, translateHebcalLeyningToResponsibility);
      _.forEach(responsibilities, function(responsibility) {
        if(responsibility.type) {
          serviceToCreate.addResponsibility(responsibility.type, responsibility.detail);
        }
      });

      serviceRepository.createService(serviceToCreate, function(err) {
        if(err) throw err;
      });
    }, function(err) {
      if(err) {
        console.log("Error: " + err);
      } else {
        console.log("Done!");
      }
    });
  });
}

module.exports = getServices;
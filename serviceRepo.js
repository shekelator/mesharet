var Mongo = require("mongodb");
var MongoClient = Mongo.MongoClient;
var ObjectId = Mongo.ObjectID;
var assert = require('assert');
var _ = require("lodash");
var Service = require('./service');

var connectionString = process.env.MONGO_CONNECTION || "mongodb://127.0.0.1/services";

var responsibilitySerializer = function(responsibility) {
  return {
      "type": responsibility.type,
      "detail": responsibility.detail
  };
};

var addResponsibility= function(responsibility, callback) {
  var serviceId = responsibility.serviceId;

  MongoClient.connect(connectionString, function(err, db) {
    if(err) {
     throw err; 
    }

    db.collection("services")
      .update({"_id": ObjectId(serviceId)}, 
        { $addToSet: { responsibilities: responsibilitySerializer(responsibility) } },
        {safe: true, w:1, multi: false, upsert: true}, 
        function(err, objects) {
          if(err) {
            console.warn(err.message);
          }

          db.close();
          callback(err, objects);
        });
  });
};


var createService = function(service, callback) {
  var serviceId = service.serviceId;

  MongoClient.connect(connectionString, function(err, db) {
    if(err) {
     throw err; 
    }

    var serializedService = {
      "date": service.date.toJSON(),
      "responsibilities": _.map(service.responsibilities, responsibilitySerializer),
      "title": service.title
    };

    db.collection("services")
      .update({"date": serializedService.date}, 
        serializedService,
        {safe: true, w:1, multi: false, upsert: true}, 
        function(err, objects) {
          if(err) {
            console.warn(err.message);
          }

          db.close();
          callback(err, objects);
        });
  });
};

var getServices = function(callback) {

  MongoClient.connect(connectionString, function(err, db) {
    if(err) {
     throw err; 
    }

    db.collection("services")
      .find({}).toArray( 
        function(err, objects) {
          if(err) {
            console.warn(err.message);
          }

          var result = _.map(objects, function(obj) {
            var svc = new Service();
            svc.deserialize(obj);
            return svc;
          });

          db.close();
          callback(err, result);
        });
  });
};

var repository = {
  addResponsibility: addResponsibility,
  createService: createService,
  getServices: getServices
};

module.exports = repository;

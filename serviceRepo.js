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
      "detail": responsibility.detail,
      "volunteer": responsibility.volunteer
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
  MongoClient.connect(connectionString, function(err, db) {
    if(err) {
     throw err; 
    }

    var serializedService = service.serialize();

    db.collection("services")
      .insert([serializedService],
        function(err, objects) {
          if(err) {
            console.warn(err.message);
          }

          db.close();
          callback(err, objects);
        });
  });
};

var updateService = function(service, callback) {
  MongoClient.connect(connectionString, function(err, db) {
    if(err) {
     throw err; 
    }
    var serializedService = service.serialize();

    db.collection("services")
      .update({"_id": ObjectId(serializedService._id)}, 
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

var getServiceById = function(id, callback) {
  MongoClient.connect(connectionString, function(err, db) {
    if(err) {
     throw err; 
    }

    db.collection("services")
      .findOne({ "_id": ObjectId(id)},
        function(err, retrieved) {
          if(err) {
            console.warn(err.message);
          }

          var svc = new Service();
          svc.deserialize(retrieved);

          db.close();
          callback(err, svc);
        });
  });  
};

var getService = function(date, callback) {

  MongoClient.connect(connectionString, function(err, db) {
    if(err) {
     throw err; 
    }

    db.collection("services")
      .findOne({ "date": date},
        function(err, retrieved) {
          if(err) {
            console.warn(err.message);
          }

          var svc = new Service();
          svc.deserialize(retrieved);

          db.close();
          callback(err, svc);
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
  update: updateService,
  createService: createService,
  getServices: getServices,
  getService: getService,
  getServiceById: getServiceById
};

module.exports = repository;

var MongoClient = require("mongodb").MongoClient;
var assert = require('assert');

var connectionString = process.env.MONGO_CONNECTION || "mongodb://127.0.0.1/services";

var responsibilitySerializer = function(responsibility) {
  return {
    "date": responsibility.date.toJSON(),
    "type": responsibility.type,
    "detail": responsibility.detail
  };
};

var setService= function(responsibility, callback) {
  var date = responsibility.date;

  MongoClient.connect(connectionString, function(err, db) {
    if(err) {
     throw err; 
    }

    db.collection("services")
      .update({"date": date}, 
        responsibilitySerializer(responsibility), 
        {safe: true, w:1, multi: false, upsert: true}, 
        function(err, objects) {
          if(err) {
            console.warn(err.message);
          }

          db.close();
          callback(err, objects);
        });
  })
};

var repository = {
  set: setService
};

module.exports = repository;

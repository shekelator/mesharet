var moment = require('moment');
var Responsibility = require('./responsibility');
var _ = require('lodash');

var responsibilityTypes = {
  "1": "Torah reading",
  "2": "Maftir reading",
  "3": "Haftarah reading",
  "4": "Besorah reading",
  "5": "Gabbai rishon",
  "6": "Nursery"
}

var displayResponsibility = function(resp) {
  return {
    "type": resp.type,
    "description": responsibilityTypes[resp.type],
    "detail": resp.detail
  };
};

var Service = function(date, title) {
  var parsedDate = moment(date);

  if(!parsedDate.isValid()) {
    throw new Error("Invalid date: " + date);
  }

  this.date = parsedDate; // TODO truncate times
  this.title = title;
  this.responsibilities = [];

  this.addResponsibility = _.bind(function(responsibilityType, detail) {
    this.responsibilities.push({ "type": Number(responsibilityType), "detail": detail });
  }, this);

  this.deserialize = _.bind(function(obj) {
    this._id = obj._id;
    this.date = moment(obj.date);
    if(!this.date.isValid()) {
      throw new Error("Invalid date: " + obj.date);
    }

    this.title = obj.title,
    this.responsibilities = obj.responsibilities;
    return this;
  }, this);

  this.serialize = _.bind(function() {
    return {
      "_id": this._id,
      "date": this.date.toJSON(),
      "title": this.title,
      "responsibilities": this.responsibilities
    };
  }, this);

  this.display = _.bind(function() {
    return {
      "date": this.date.format("dddd, MMMM Do YYYY"),
      "title": this.title,
      "responsibilities": _.map(this.responsibilities, displayResponsibility)
    };
  }, this);

  return this;
};

module.exports = Service;

var moment = require('moment');
var Responsibility = require('./responsibility');
var _ = require('lodash');

var Service = function(date, title) {
  var parsedDate = moment(date);
  if(!parsedDate.isValid()) {
    // TODO what to do here?
  }
  this.date = parsedDate; // TODO truncate times
  this.title = title;
  this.responsibilities = [];

  this.addResponsibility = _.bind(function(responsibilityType, detail) {
    var responsibility = new Responsibility(null, responsibilityType, detail);
    this.responsibilities.push(responsibility);
  }, this);

  this.deserialize = _.bind(function(obj) {
    this.date = moment(obj.date).format("dddd, MMMM Do YYYY");
    this.title = obj.title,
    this.responsibilities = obj.responsibilities;
  }, this);

  return this;
};


module.exports = Service;

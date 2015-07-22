var moment = require('moment');
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
    "detail": resp.detail,
    "volunteer": resp.volunteer
  };
};

var Service = function(date, title) {
  var parsedDate = moment(date);

  var getResponsibility = function(responsibilityType, responsibilities) {
    return _.find(responsibilities, function(resp) {
      return resp.type === Number(responsibilityType);
    });
  };

  if(!parsedDate.isValid()) {
    throw new Error("Invalid date: " + date);
  }

  this.date = parsedDate; // TODO truncate times
  this.title = title;
  this.responsibilities = [];

  this.addResponsibility = _.bind(function(responsibilityType, detail) {
    this.responsibilities.push({ "type": Number(responsibilityType), "detail": detail });
  }, this);

  this.signUp = _.bind(function(responsibilityType, id) {

    var responsibilitySignedUpFor = getResponsibility(responsibilityType, this.responsibilities);

    if(responsibilitySignedUpFor) {
      responsibilitySignedUpFor.volunteer = id;
    }
  }, this);

  this.cancel = _.bind(function(responsibilityType, userId) {
    var responsibilitySignedUpFor = getResponsibility(responsibilityType, this.responsibilities);

    if(responsibilitySignedUpFor && responsibilitySignedUpFor.volunteer === userId) {
      responsibilitySignedUpFor.volunteer = null;
    }
  }, this);

  this.deserialize = _.bind(function(obj) {
    if(obj._id) {
      this._id = obj._id;
    }
    
    this.date = moment(obj.date);
    if(!this.date.isValid()) {
      throw new Error("Invalid date: " + obj.date);
    }

    this.title = obj.title,
    this.responsibilities = obj.responsibilities;
    return this;
  }, this);

  this.serialize = _.bind(function() {
    var result = {
      "_id": this._id,
      "date": this.date.toJSON(),
      "title": this.title,
      "responsibilities": this.responsibilities
    };

    if(this._id) {
      result._id = this._id;
    }

    return result;
  }, this);

  this.display = _.bind(function() {
    return {
      "id": this._id,
      "date": this.date.format("MMMM D YYYY"),
      "title": this.title,
      "responsibilities": _.map(_.sortBy(this.responsibilities, "type"), displayResponsibility)
    };
  }, this);

  return this;
};

module.exports = Service;

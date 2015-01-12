var moment = require('moment');

var responsibilityTypes = {
  "1": "Torah reading",
  "2": "Haftarah reading",
  "3": "Besorah reading",
  "4": "Gabbai rishon",
  "5": "Nursery"
}

var Responsibility = function(date, responsibilityType, detail) {
	var parsedDate = moment(date);
  if(!parsedDate.isValid()) {
    // TODO what to do here?
  }
  this.date = parsedDate; // TODO truncate times
  this.type = responsibilityType;
  this.detail = detail;

  return this;
};

Responsibility.prototype.types = responsibilityTypes;

module.exports = Responsibility;

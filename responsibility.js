
var responsibilityTypes = {
  "1": "Torah reading",
  "2": "Maftir reading",
  "3": "Haftarah reading",
  "4": "Besorah reading",
  "5": "Gabbai rishon",
  "6": "Nursery"
}

var Responsibility = function(serviceId, responsibilityType, detail) {

  this.type = responsibilityType;
  this.detail = detail;
  this.serviceId = serviceId;

  return this;
};

Responsibility.prototype.types = responsibilityTypes;

module.exports = Responsibility;

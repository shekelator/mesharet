var should = require('should');
var Service = require('../service');

describe('service', function() {
	describe('#display', function() {
		it('should create object with display method', function(done) {
			var svc = new Service('2015-06-11', 'Parashat Miqqetz');
			(typeof svc.display).should.equal("function");
      svc.display()['date'].should.equal('Thursday, June 11th 2015');
      svc.responsibilities.length.should.equal(0);
      svc.title.should.equal("Parashat Miqqetz");
      done();
		});

    it('throws on invalid date', function() {
      (function() {
        var svc = new Service('2015-06-42', 'Random shabbat');
      }).should.throw("Invalid date: 2015-06-42");
    });
	});

  describe("#addResponsibility", function() {
    it('should add responsibilities', function() {
      var svc = new Service('2015-06-11', 'Parashat Miqqetz');
      svc.addResponsibility(3, "Exodus 2");
      svc.responsibilities.length.should.equal(1);
      svc.display().responsibilities[0].description.should.equal("Haftarah reading");
      svc.display().responsibilities[0].detail.should.equal("Exodus 2");
      
      svc.addResponsibility("6", "volunteer 1");
      svc.display().responsibilities[1].description.should.equal("Nursery");
      svc.display().responsibilities[1].type.should.equal(6);
      svc.display().responsibilities[1].detail.should.equal("volunteer 1");
    });
  });

  describe("#serialize", function() {
    it('should serialize and deserialize properly', function() {
      var svc = new Service('2015-06-11', 'Parashat Vaera');
      svc.addResponsibility(1, "Exodus 2.1-6.1");
      svc.addResponsibility(2, "Numbers 29.10-17");
      svc.addResponsibility(6, "Volunteer");

      var serialized = svc.serialize();
      serialized.should.have.property("date", "2015-06-11T04:00:00.000Z");
      serialized.should.have.property("title", "Parashat Vaera");
      serialized.responsibilities.should.containEql({type: 1, detail: "Exodus 2.1-6.1"});
      serialized.responsibilities.should.containEql({type: 6, detail: "Volunteer"});

      // deserializes properly
      var svc2 = new Service().deserialize(serialized);
      svc2.serialize().should.eql(svc.serialize());
      svc2.display().should.eql(svc.display());
    });

    it('throws on invalid date', function() {
      (function() {
        var svc = new Service().deserialize({ 'date': '2015-06-42', 'title': 'Random shabbat'});
      }).should.throw("Invalid date: 2015-06-42");
    });
    
  });
});

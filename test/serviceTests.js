var should = require('should');
var Service = require('../service');

describe('service', function() {
	describe('#display', function() {
		it('should create object with display method', function(done) {
			var svc = new Service('2015-06-11', 'Parashat Miqqetz');
			(typeof svc.display).should.equal("function");
      svc.display()['date'].should.equal('Thursday, June 11th 2015');
      done();
		});
	});
});

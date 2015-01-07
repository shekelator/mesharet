var saveUser = function(user, done) {
	done(null);
};

var getUser = function(id, done) {
  done(null, { id: id, name: {familyName: "Tannehill"}, displayName: "Ryan Tannehill", provider: "local" });
}

module.exports = { save: saveUser, get: getUser};

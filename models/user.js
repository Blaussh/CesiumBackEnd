var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = new mongoose.Schema({
	username: {
		type: String
	},
	password: {
		type: String
	},
    isAdmin : {
        type: Boolean
    }

}, { collection: 'users' });

// Hook function : 'save' generate salt
UserSchema.pre('save',function(next){
    var user = this;

	var query = {username : this.username};
	mongoose.model('UserModel', UserSchema).find(query, function(err, document){

		// Not taken generate password using salt
		bcrypt.genSalt(10, function(err, salt) {
			if(err) return next(err);

			bcrypt.hash(user.password, salt, function(err, hash) {
				if(err) return next(err);
				user.password = hash;
				next();
			});
		});
		
	});
	
});

// Compare passwords function, candidatePassword with real hashed password
UserSchema.methods.comparePassword = function(candidatePassword, callback){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return next(err);
    	callback(null, isMatch);
	});
};

module.exports = mongoose.model('UserModel', UserSchema);
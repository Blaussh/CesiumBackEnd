var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../../models/user.js');

module.exports = function(app){
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            if(err) return done(err);
            done(null, user);
        });
    });

    require('./strategies/local.strategy')();
    require('./strategies/bearer.strategy')();
};
 
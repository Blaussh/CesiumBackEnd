var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../../models/user.js');

module.exports = function () {
    passport.use(new LocalStrategy( function(username,password, done){
            var query = {username : username};
            User.findOne(query,function(err,user){

                if(user){

                  user.comparePassword(password, function(err, result){
                        if (err)
                            return done(err);
                        if (!result)
                            return done('wrong password',null);
                        return done(null,user);
                    });

                }
                else{
                    return done('user not found',null);
                }

            });
        
    }))

};
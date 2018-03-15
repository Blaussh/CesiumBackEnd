
var passport = require('passport');
var BearerStrategy  = require('passport-http-bearer').Strategy;
var User = require('../../../models/user.js');
var jwt = require('jwt-simple');
var moment = require('moment');     

var SECRET = "AK-47";

//Authorization: Bearer <access token>
module.exports = function () {
    passport.use(new BearerStrategy(
        function(token, done) {
            if (! token )
                return done(null,false,{message: "token was not found"});
            
            var payload = jwt.decode(token,SECRET);
            var now = moment().unix();
            // 1) Time
            if (payload.exp < now){
                return done(null,false, { message : "Token is Expired."});
            }
            // 2) User
            var query = {_id : payload.sub};
            User.findOne(query, function(err,user){
                if (err) {
                    return done(null,false, {message : "error getting user."});
                }
                if (!user){
                    return done(null, false, { message : "User does not exist."});
                }

                // All OK
                return done(null, user, {scope: '*'});
            });


    }))
};

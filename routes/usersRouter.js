// Base imports
var express = require('express');
var router = express.Router();

// Models
var User = require('../models/user.js');

// Authentication imports 
var passport = require('passport'); //to use password authentication systems (straties)
var jwt = require('jwt-simple');    //to encrypt/decrypt token
var moment = require('moment');     //to use time cacluations [days, currect date]

var SECRET = "AK-47";
var FAIL =  400;
var CREATED = 201;
var OK = 200;

// DEBUG>>>>>>>>>>>>>>>>>>>>>>>>>
// ADD NEW USER WITHOUT PREMISSIONS
router.post('/add',  
        function(req, res ){

            var username    = req.body.username;
            var password    = req.body.password;
            var isAdmin     = req.body.isAdmin;

            var newUser = new User({
                username: username,
                password: password,
                isAdmin : isAdmin
            });

            newUser.save(function(err){
                if(!err)
                    res.json({ status: CREATED, message: "User Created"});
           
            });

});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// ADD NEW USER
router.post('/adduser', 
    passport.authenticate('bearer', { session: false }), 
        function(req, res ){

            if (! req.user.isAdmin ) return res.json({status: FAIL, message:"must be admin to add user"});

            var username    = req.body.username;
            var password    = req.body.password;
            var isAdmin     = req.body.isAdmin;

            var newUser = new User({
                username: username,
                password: password,
                isAdmin : isAdmin
            });

            newUser.save(function(err){
                if(!err)
                    res.json({ status: CREATED, message: "User Created"});
           
            });

});

// LOGIN 
router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
      var user = req.user;

      var token = generateToken(user); 
      req.login(user, function(err){
     
            if (err) {    console.log('here'); return  res.json({status: FAIL, message:err}); }
            user.password = '';
            res.json({ status: OK , token: token, user:user});
      })
});

// LOGOUT
router.post('/logout', function(req, res){
	req.logout();
    res.json({ status: OK, message: "User Logged Out"});
});

// EDIT USER
router.put('/edit/:uid', 
    passport.authenticate('bearer', { session: false }),
        function(req,res) {
            
            if (! req.user.isAdmin ) return res.json({status: FAIL, message:"must be admin to edit user"});

            User.findById(req.params.uid, function(err, user){
                if (err) return res.json({status: FAIL, message:"wrong user id"});
                
                user.username    = req.body.username;
                user.password    = req.body.password;
                user.isAdmin     = req.body.isAdmin;

                user.save(function(err){
                    if(err) return res.json({status: FAIL, message:"failed save "+err});
                    return res.json({status: OK, message:"edit saved"});
                });
            });
    }
);

// DELETE USER
router.delete('/edit/:uid', 
    passport.authenticate('bearer', { session: false }),
        function(req,res) {
            
            if (! req.user.isAdmin ) return res.json({status: FAIL, message:"must be admin to delete user"});

            User.findById(req.params.uid, function(err, doc){
                if (err) return res.json({status: FAIL, message: err});
                
                User.remove({_id: doc._id}, function(err,doc){
                    if (err) return res.json({status: FAIL, message: err});
                        return res.json({status: OK, message:"user deleted"});
                }); 
            });
        }
);

// GET ALL USERS
router.get("/all", passport.authenticate('bearer', { session: false }), 
   function(req, res){

        if (! req.user.isAdmin ) return res.json({status: FAIL, message:"must be admin to delete user"});

       User.find(function(err, users) {
           if(err)
               return res.send(err);
           return res.json(users);
       });
   });

router.post("/shai", (req,res) => {
    console.log(req.body);
})


// IS ADMIN USER
router.get("/isadmin/:token", 
   function(req, res){
       var isAdmin = false;
       var payload = jwt.decode(req.params.token,SECRET);
        User.findById(payload.sub, function(err,user){
            if (err) return false; 
            return res.send(user.isAdmin);
        });
   });

// Function to generate token
function generateToken(user){
    var payload = {
        sub : user._id,
        iat : moment().unix(),
        exp : moment().add(2,"weeks").unix()
    };
    var token = jwt.encode(payload,SECRET);
    return token;
};

module.exports = router;
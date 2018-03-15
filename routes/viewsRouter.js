// Base imports
var express = require('express');
var router = express.Router();

// Models
var ViewModel = require('../models/view.js');

// Authentication imports 
var passport = require('passport');

var SECRET = "AK-47";
var FAIL =  400;
var CREATED = 201;
var OK = 200;

// GET ALL VIEWS
router.get('/views', 
    passport.authenticate('bearer', { session: false }),
        function(req,res) {
       
        ViewModel.find( {} ,function(err,  views){
            if (err) return res.json({status: FAIL, message:err});
            
            res.json(views);
            
        });
    }
);

// ADD A NEW VIEW
router.post('/views', 
    passport.authenticate('bearer', { session: false }),
        function(req,res) {
            
        if (! req.user.isAdmin ) return res.json({status: FAIL, message:"must be admin to add view"});

        var newView =  new ViewModel({

            	viewName: req.body.viewName,
                centerLocation: {
                    x :  req.body.centerx,
                    y:  req.body.centery 
                },
                items :  req.body.items
        });

        newView.save(newView, function(err){
            if (err) 
                return res.json({status: FAIL, message:err});

            return res.json({status: OK});
        });
       
    }
);

// GET A SINGLE VIEW
router.get('/view/:viewid', 
    passport.authenticate('bearer', { session: false }),
        function(req,res) {
                    
        ViewModel.findById(req.params.viewid,function(err, view){
            if (err) return res.json({status: FAIL, message:err});
            
            res.json(view);
            
        });
    }
);


router.delete('/view/:viewid', passport.authenticate('bearer', { session: false }), function (req, res) {

    if (!req.user.isAdmin) return res.json({ status: FAIL, message: "must be admin to delete view" });

    ViewModel.findById(req.params.viewid, function (err, doc) {
        if (err) return res.json({ status: FAIL, message: err });

        ViewModel.remove({ _id: doc._id }, function (err, doc) {
            if (err) return res.json({ status: FAIL, message: err });
            return res.json({ status: OK, message: "view deleted" });
        });
    });
});

// EDIT A SINGLE VIEW
// NOT SUPPORTED 
router.put('/views/',
    passport.authenticate('bearer', { session: false }),
        function(req,res) {
            
        if (! req.user.isAdmin ) return res.json({status: FAIL, message:"must be admin to add view"});

        var incomingView = req.body.view;
        ViewModel.findById(incomingView._id, function(err,view){
            if (err) return res.json({status: FAIL, message:"no such viewID"});

            view.centerLocation.x = incomingView.centerLocation.x;
            view.centerLocation.y = incomingView.centerLocation.y;
            view.viewName = incomingView.viewName;
            view.items = incomingView.items;

            view.save(function(err){

                if (err) return res.json({status: FAIL, message: "err saving" });

                return res.json({status: OK, message: "view was updated" });
            });

        });
       
    }
);


module.exports = router;
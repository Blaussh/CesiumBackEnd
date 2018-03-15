var mongoose = require('mongoose');

// View Schema
var ViewSchema = new mongoose.Schema({
	viewName: {
		type: String
	},
	centerLocation: {
		x : Number,
        y : Number 
	},
    items : [ {position_x: Number, position_y: Number, position_z: Number, classification : String}  ],
}, { collection: 'views' });

module.exports = mongoose.model('ViewModel', ViewSchema );

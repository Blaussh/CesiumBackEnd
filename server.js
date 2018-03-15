// server.js

// declare imports [packages]
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cors = require('cors');

// declare routes
var viewsRouter = require('./routes/viewsRouter.js');
var usersRouter = require('./routes/usersRouter.js')

// declare general variables 
var app = express();
var port = process.env.PORT || 8080;
var localDatabaseURL = 'mongodb://yvniDev:deva1604@ds243055.mlab.com:43055/full-stack-devalore';

//  define middleware [add to the middleware stack the operations done when routing]
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(function (req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//configs passport
require('./routes/auth/passport.js')(app);

// db handler
mongoose.Promise = global.Promise;
mongoose.connect(localDatabaseURL, {
  useMongoClient: true,
  /* other options */
}, (err) => {
  if(!err)
    console.log('connected to mongo ');
});


// hello world
// app.get('/', (req,res) => {
//   res.send('hello world')
// })

// register routes
app.use('/api', viewsRouter);
app.use('/users', usersRouter);

// start the server
app.listen(port);
console.log("Server is listening to " + port);  

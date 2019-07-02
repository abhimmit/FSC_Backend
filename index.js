const express = require('express');
// var cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// set up express app
const app = express();


/*
var allowedOrigins = ['//10.0.0.11:8081'];

app.use(cors({

  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },

  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],

  credentials: true,
}));
*/

//set up static files
app.use(express.static('public'));

// use body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use( (req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Origin , X-Requested-With, Content-Type, Accept, Authorization');
   if(req.method === 'OPTIONS') {
	   res.header('Access-Control-Allow-Methods', 'PUT, PATCH, POST, DELETE , GET');
	   return res.status(200).json({});
   }
   next();
});


// initialize routes
app.use('/', require('./routes/api'));

// Import configuration variables.
require('dotenv').config({path: '.env'});

// error handling middleware
app.use(function(err, req, res, next){
    console.log(err); // to see properties of message in our console
    res.status(422).send({error: err.message});
});

// listen for requests
// let port = process.env.PORT;
var listener = app.listen( { port: process.env.PORT || 4000 } , function() {

		console.log(`now listening for requests to ${ listener.address().port }`);
	});

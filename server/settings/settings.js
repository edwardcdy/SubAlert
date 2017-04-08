var express     = require('express');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

var app = module.exports = express();

mongoose.connect('mongodb://heroku_b34psj7q:whoknows121!@ds157040.mlab.com:57040/heroku_b34psj7q'); //mongodb://localhost:27017

// Lets us get information from post requests
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Use morgan to log requests to console
app.use(morgan('dev'));

// make sure app can use CORS requests
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET','POST');
  res.setHeader('Access-Control-Allow-Header','X-Requested-With, content-type, Authorization');
  next();
});

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
// Polyfill to replace object.keys on older browsers
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

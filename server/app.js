// Imports and important variables
// ----------------------------------------
// Imported modules
var express     = require('express');
var app         = express();
var mongoose    = require('mongoose');
var apiRouter   = express.Router();

var settings    = require('./settings/settings');
var routes      = require('./routes/routes');
var check       = require('./check');

// External variables and addresses
var port        = process.env.PORT || 8080;

// Setting up routes
// -------------------------------------

// static frontend
app.use(express.static('frontend'));

// Everything under our apiRouter is accessed at /api
app.use('/api',apiRouter);

// Apply "settings" (Console debugging, bodyparsing, CORS headers)
apiRouter.use(settings);

// routes
apiRouter.use(routes);

check(60);

// Start the server
// ---------------------------------------
app.listen(port);
console.log('Application running on port:' + port);
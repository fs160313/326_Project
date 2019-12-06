// Express backend API route definitions
let express = require('express');
// Import the routes we set in the configuration
let routes = require('./config/routes.js');

// Middleware setup imports
let morgan = require('morgan');
let bodyParser = require('body-parser');

let app = express();

// Set up middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set up static files directory
app.use(express.static('public'));

// Set up routes
routes(app);

module.exports = app;

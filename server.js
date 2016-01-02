//Base setup
//Call the packages
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

//configuration
var config = require('./config');

//Use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//configure app to handle CORS requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

//log requests to console
app.use(morgan('dev'));

//connect to database
mongoose.connect(config.database);

//static files location for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

//routing
var apiRouter = require('./app/routes/api')(app, express);
app.use('/api', apiRouter);

//catchall route
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


//start the server and log this event
app.listen(config.port);
var date = new Date();
var dateStr = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
console.log('Magic happens on port ' + config.port + ' at ' + dateStr);

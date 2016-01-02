var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;

//configuration
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \Authorization');
    next();
});

app.use(morgan('dev'));

//routing
app.get('/', function (req, res) {
    res.send('Welcome to the home page');
});

var apiRouter = express.Router();
apiRouter.get('/', function (req, res) {
    res.json({
        message: 'You are now in api pages'
    });
});

app.use('/api', apiRouter);

app.listen(port);
var date = new Date();
var dateStr = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
console.log('Magic happens on port ' + port + ' at ' + dateStr);

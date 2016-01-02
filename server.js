//Base setup

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;

//Database
mongoose.connect('mongodb://localhost:27017/crm');
var User = require('./app/models/user');

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
apiRouter.use(function (req, res, next) {
    console.log('Somebody just came to our app');
    //authentication will happen here
    next();
});



apiRouter.get('/', function (req, res) {
    res.json({
        message: 'You are now in api pages'
    });
});

apiRouter.route('/users').post(function (req, res) {
    var user = new User();
    user.name = req.body.name;
    user.userName = req.body.userName;
    user.password = req.body.password;
    //save the user and check for errors
    user.save(function (err) {
        if (err) {
            if (err.code == 11000) { //duplicate entry 
                return res.json({
                    success: false,
                    message: 'A user with that username already exists'
                });
            } else {
                return res.send(err);
            }
        }
        res.json({
            message: 'User created!'
        });
    });
}).get(function (req, res) {
    User.find(function (err, users) {
        if (err) res.send(err);
        res.json(users);
    });
});
apiRouter.route('/users/:user_id').get(function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        if (err) res.send(err);
        res.json(user);
    });
}).put(function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        if (err) res.send(err);
        if (req.body.name) user.name = req.body.name;
        if (req.body.userName) user.userName = req.body.userName;
        if (req.body.password) user.password = req.body.password;
        user.save(function (err) {
            if (err) res.send(err);
            res.json({
                message: 'User updated!'
            });
        })
    })
}).delete(function (req, res) {
    User.remove({
        _id: req.params.user_id
    }, function (err, user) {
        if (err) res.send(err);
        res.json({
            message: 'User successfully deleted!'
        });
    })
});

app.use('/api', apiRouter);

app.listen(port);
var date = new Date();
var dateStr = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
console.log('Magic happens on port ' + port + ' at ' + dateStr);

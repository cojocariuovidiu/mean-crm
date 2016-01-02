var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var apiRouter = express.Router();
var superSecret = 'JamesonsIsMyFavoriteDrink';

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

module.exports = apiRouter;

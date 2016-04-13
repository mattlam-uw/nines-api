/**
 * API Router for /users
 * Translates API URL (resource) calls to calls against IO methods for Users Model.
 * Current Users model is MongoDB-based. If a different database is to be used,
 * then a new IO methods file for the model will need to be provided and
 * required here in place of users_API_IO_Mongo.js
 */

// Node.js Module Dependencies
var express = require('express');
var router = express.Router();
var Users = require('../models/Users_Mongo');
var logger = require('../modules/logger.js');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users');
}

module.exports = function(passport) {

    /* GET Login Page */
    router.get('/', function(req, res) {
       // Display the Login page with message, if applicable
        res.render('index');
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate(
        'login', {
            successRedirect: 'home',
            failureRedirect: '/users',
            failureFlash: true
        }
    ));

    /* GET Registration Page */
    router.get('/register', function(req, res) {
        res.render('register');
    });

    /* Handle Registration POST */
    router.post('/register', passport.authenticate(
        'register', {
            successRedirect: 'home',
            failureRedirect: 'register',
            failureFlash: true
        }
    ));

    /* GET Home Page */
    router.get('/home', isAuthenticated, function(req, res) {
        res.render('home', { user: req.user });
    });

    /* GET all users */
    router.get('/users', isAuthenticated, function(req, res) {
        Users.find(function(err, returnVal) {
            if (err) return next(err);
            res.json(returnVal);
        });
    })

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/users');
    });

    return router;
};
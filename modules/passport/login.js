/**
 * Created by mattlam on 4/12/2016.
 */
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/Users_Mongo.js');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {

    passport.use(
        'login',
        new LocalStrategy(
            { passReqToCallback: true },
            function(req, username, password, done) {

                // check on DB if a user with username exists or not
                User.findOne({ 'username': username }, function(err, user) {

                    // In case of any error, return using the done method
                    if (err) {
                        return done(err);
                    }
                    // Username does not exist, log error & redirect back
                    if (!user) {
                        console.log('User not found', username);
                        return done(null, false);
                    }
                    // User exists but wrong password; log the error
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid password');
                        return done(null, false);
                    }
                    // User and password both match; return user from done
                    // method -- success
                    return done(null, user);
                });
            }
        )
    );

    // Use encryption for messaging with database for password validation
    function isValidPassword(user, password) {
        return bCrypt.compareSync(password, user.password);
    }
};
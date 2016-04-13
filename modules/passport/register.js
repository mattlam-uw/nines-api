/**
 * Created by mattlam on 4/12/2016.
 */
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/Users_Mongo');
var bCrypt = require('bCrypt-nodejs');

module.exports = function(passport) {

    passport.use(
        'register',
        new LocalStrategy(
            { passReqToCallback: true },
            function(req, username, password, done) {

                function findOrCreateUser() {

                    // Find a user in DB with given username
                    User.findOne(
                        { 'username': username },
                        function(err, user) {

                            // In case of any error, return using done method
                            if (err) {
                                console.log('Registration error:', err);
                                return done(err);
                            }

                            // User already exists
                            if (user) {
                                console.log('User already exists:', username);
                                return done(null, false);

                            // User does not exist, so create one
                            } else {
                                // Create User object for adding to DB
                                var newUser = new User();

                                // Set user's local credentials
                                newUser.username = username;
                                newUser.password = createHash(password);
                                newUser.date_added = new Date();

                                // Save user to the DB
                                newUser.save(function(err) {
                                    if (err) {
                                        console.log(
                                            'Error saving user to database:',
                                            err
                                        );
                                        throw err;
                                    }
                                    console.log('User registration successful');
                                    return done(null, newUser);
                                });
                            }
                        }
                    );
                }
                // Delay the execution of findOrCreateUser and execute the
                // method in the next tick of the event loop
                process.nextTick(findOrCreateUser);
            }
        )
    );

    // Generates hash using bCrypt
    function createHash(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
};
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./modules/config-convey'); // Config data
var errors = require('./routes/errors'); // Methods for processing calls to /errors
var events = require('./routes/events'); // Methods for processing calls to /events
var urls = require('./routes/urls'); // Methods for processing calls to /routes
var db = require('./modules/database'); // Provide connection to database

var app = express();

// Connect to database
db.openConnection();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Allows reading resource located at same origin as client
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", config.ninesWebHost);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requrested-With, Content-Type, Accept");
    next();
});

app.use('/errors', errors);
app.use('/events', events);
app.use('/urls', urls);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

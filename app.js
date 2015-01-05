var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("Username: " + username);
        if(password === "tacotaco") {
            return done(null, { id: 0, name: "Peloni", username: username });
        } else {
            return done(null, false);
        }
    })
);

var facebookAppId = process.env.FACEBOOK_APPID || "abcde123";
var facebookSecret = process.env.FACEBOOK_SECRET || "lskjdf0923jfsdf";
var hostname = process.env.HOSTNAME || "localhost";
passport.use(new FacebookStrategy({
    clientID: facebookAppId,
    clientSecret: facebookSecret,
    callbackURL: "http://" + hostname + "/auth/facebook/callback"
},
    function(accessToken, refreshToken, profile, done) {
        console.log("Received token for " + profile.name.familyName);
        done(null, profile);
    }
));


passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    done(null, {id: 0, name: "Unknown", username: username });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session( {secret: "wat!???!!?!?", resave: "false", saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes(express, passport));
app.use('/users', users(express, passport));
app.use('/login', login(express, passport));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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

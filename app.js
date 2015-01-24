var express = require('express'),
    request = require('request'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    routes = require('./api/routes'),
    path = require('path'),
    url = require('url'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy;

// insert your app key and secret here
var APP_KEY = '5qrvnudv5gltoy8';
var APP_SECRET = 'ystltok87pzc6ue';

var app = module.exports = express();
var env = process.env.NODE_ENV || 'development';


app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    passport.use(new DropboxOAuth2Strategy({
        clientID: APP_KEY,
        clientSecret: APP_SECRET,
        //callbackURL: "http://localhost:8080/callback"
        callbackURL: "https://dropboxreports.herokuapp.com/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        done(null, profile);
    }
    ));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.bodyParser());
    app.use(app.router);
});

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('json spaces',4);

// development only
if (env === 'development') {
    app.use(errorHandler());
}

// production only
if (env === 'production') {
    // No error handler in production for now.
}

app.get('/', routes.home);
app.get('/login', passport.authenticate('dropbox-oauth2'));
app.get('/callback',
    passport.authenticate('dropbox-oauth2', { failureRedirect: '/login' }),
        function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/stats');
});
app.get('/stats', function (req, res) { res.render('stats')});

// start server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

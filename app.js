var express = require('express'),
    request = require('request'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    routes = require('./api/routes'),
    path = require('path'),
    url = require('url'),
    passport = require('passport-dropbox-oauth2');

// insert your app key and secret here
var APP_KEY = '5qrvnudv5gltoy8';
var APP_SECRET = 'ystltok87pzc6ue';


var app = module.exports = express();
var env = process.env.NODE_ENV || 'development';

passport.use(new DropboxOAuth2Strategy({
    clientID: APP_KEY,
    clientSecret: APP_SECRET,
    callbackURL: "http://localhost:8080/callback"
    //callbackURL: "https://dropboxreports.herokuapp.com/callback"
},
function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ providerId: profile.id }, function (err, user) {
        return done(err, user);
    });
}
));

app.use(cookieParser());
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
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
//app.get('/login', routes.login);
//app.get('/stats', routes.stats);

// start server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

var express = require('express'),
    request = require('request'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    routes = require('./api/routes'),
    path = require('path'),
    crypto = require('crypto'),
    url = require('url'),
    cookieParser = require('cookie-parser');

// insert your app key and secret here
var APP_KEY = '5qrvnudv5gltoy8';
var APP_SECRET = 'ystltok87pzc6ue';

/*
* Helper for the login
*/
function generateCSRFToken() {
    return crypto.randomBytes(18).toString('base64')
    .replace(/\//g, '-').replace(/\+/g, '_');
}

function generateRedirectURI(req) {
    return url.format({
        protocol: req.protocol,
        host: req.headers.host,
        pathname: app.path() + '/callback'
    });
}


var app = module.exports = express();
var env = process.env.NODE_ENV || 'development';

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
//app.get('/login', function (res,req) {
//     var csrfToken = generateCSRFToken();
//     res.cookie('csrf', csrfToken);
//     res.redirect(url.format({
//         protocol: 'https',
//         hostname: 'www.dropbox.com',
//         pathname: '1/oauth2/authorize',
//         query: {
//             client_id: APP_KEY,
//             response_type: 'code',
//             state: csrfToken,
//             redirect_uri: generateRedirectURI(req)
//         }
//     }));
// });
// app.get('/callback', function (res,req) {
//     if (req.query.error) {
//         return res.send('ERROR ' + req.query.error + ': ' + req.query.error_description);
//     }
//
//     // check CSRF token
//     if (req.query.state !== req.cookies.csrf) {
//         return res.status(401).send(
//             'CSRF token mismatch, possible cross-site request forgery attempt.'
//         );
//     }
//     // exchange access code for bearer token
//     request.post('https://api.dropbox.com/1/oauth2/token', {
//         form: {
//             code: req.query.code,
//             grant_type: 'authorization_code',
//             redirect_uri: generateRedirectURI(req)
//         },
//         auth: {
//             user: APP_KEY,
//             pass: APP_SECRET
//         }
//     }, function (error, response, body) {
//         var data = JSON.parse(body);
//
//         if (data.error) {
//             return res.send('ERROR: ' + data.error);
//         }
//
//         // extract bearer token
//         var token = data.access_token;
//
//         // use the bearer token to make API calls
//         request.get('https://api.dropbox.com/1/account/info', {
//             headers: { Authorization: 'Bearer ' + token }
//         }, function (error, response, body) {
//             res.send('Logged in successfully as ' + JSON.parse(body).display_name + '.');
//         });
//     });
// });

// start server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

var crypto = require('crypto'),
    url = require('url');


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

/*
 * Serve different routes
 */
exports.index = function (req, res) {

};

exports.login = function (req, res) {
    var csrfToken = generateCSRFToken();
    res.cookie('csrf', csrfToken);
    res.redirect(url.format({
        protocol: 'https',
        hostname: 'www.dropbox.com',
        pathname: '1/oauth2/authorize',
        query: {
            client_id: APP_KEY,
            response_type: 'code',
            state: csrfToken,
            redirect_uri: generateRedirectURI(req)
        }
    }));
};
exports.callback = function (req, res) {
    if (req.query.error) {
        return res.send('ERROR ' + req.query.error + ': ' + req.query.error_description);
    }

    // check CSRF token
    if (req.query.state !== req.cookies.csrf) {
        return res.status(401).send(
            'CSRF token mismatch, possible cross-site request forgery attempt.'
        );
    }
    // exchange access code for bearer token
    request.post('https://api.dropbox.com/1/oauth2/token', {
        form: {
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri: generateRedirectURI(req)
        },
        auth: {
            user: APP_KEY,
            pass: APP_SECRET
        }
    }, function (error, response, body) {
        var data = JSON.parse(body);

        if (data.error) {
            return res.send('ERROR: ' + data.error);
        }

        // extract bearer token
        var token = data.access_token;

        // use the bearer token to make API calls
        request.get('https://api.dropbox.com/1/account/info', {
            headers: { Authorization: 'Bearer ' + token }
        }, function (error, response, body) {
            res.send('Logged in successfully as ' + JSON.parse(body).display_name + '.');
        });
    });
};

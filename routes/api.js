/*
 * Serve JSON to our AngularJS client
 */

exports.api = function (req, res) {
  var fs = require('fs');

  res.json({
    data: JSON.parse(fs.readFileSync('me.json'))
  });
};

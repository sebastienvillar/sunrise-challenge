var googleAPI = require('../helpers/googleCalendarAPI');
var config = require('../config/config');

exports.authenticate = function(req, res, next) {
	res.redirect(googleAPI.authenticationPath());
};

exports.authenticateCallback = function(req, res, next) {
	if (req.query.error) {
		res.status(500).send(req.query.error);
		return;
	}	

	googleAPI.tokenFromCode(req.query.code, function(err, result) {
		if (err)
			res.status(500).send(err);
		else
			res.status(200).json({accessToken: result['access_token']});
	});
};



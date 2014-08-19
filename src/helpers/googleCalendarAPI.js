var url = require('url');
var config = require('../config/config');
var request = require('request');
var endPoints = {
	oauth: 'https://accounts.google.com/o/oauth2/auth',
	token: 'https://accounts.google.com/o/oauth2/token',
};

exports.authenticationPath = function() {
	var queryString = {
		response_type: 'code',
		client_id: config.google.clientId,
		redirect_uri: config.google.redirectUri,
		scope: 'https://www.googleapis.com/auth/calendar.readonly',
		state: '',
		access_type: 'online',
		approval_promt: 'auto',
		include_granted_scopes: 'false'
	};

	var path = url.format({
		pathname: endPoints.oauth,
		query: queryString
	});

	return path;
};

exports.tokenFromCode = function(code, callback) {
	var form = {
		'code': code,
		'client_id': config.google.clientId,
		'client_secret': config.google.clientSecret,
		'redirect_uri': config.google.redirectUri,
		'grant_type': 'authorization_code'
	};

	request.post({url: endPoints.token, form: form}, function(err, res, body) {
		if (err || res.statusCode != 200)
			callback(err);
		else
			callback(null, JSON.parse(body));
	});	
};
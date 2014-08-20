var url = require('url');
var config = require('../config/config');
var request = require('request');
var endPoints = {
	oauth: 'https://accounts.google.com/o/oauth2/auth',
	token: 'https://accounts.google.com/o/oauth2/token',
	calendarList: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
	colors: 'https://www.googleapis.com/calendar/v3/colors',
	events: 'https://www.googleapis.com/calendar/v3/calendars/:id/events'
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
			callback(err ? err : JSON.parse(body).error);
		else
			callback(null, JSON.parse(body));
	});	
};

exports.calendars = function(token, callback) {
	request.get({'url': endPoints.calendarList, 'qs': {'access_token': token}}, function(err, res, body) {
		if (err || res.statusCode != 200)
			callback(err ? err : JSON.parse(body).error);
		else
			callback(null, JSON.parse(body));
	});
};

exports.colors = function(token, callback) {
	request.get({'url': endPoints.colors, 'qs': {'access_token': token}}, function(err, res, body) {
		if (err || res.statusCode != 200) 
			callback(err ? err : JSON.parse(body).error);
		else
			callback(null, JSON.parse(body));
	});
};

exports.eventsForCalendarId = function(token, calendarId, callback) {
	request.get({'url': endPoints.events.replace(":id", calendarId), 'qs': {'access_token': token}}, function(err, res, body) {
		if (err || res.statusCode != 200)
			callback(err ? err : JSON.parse(body).error);
		else
			callback(null, JSON.parse(body));
	});
}
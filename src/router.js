var express = require('express');
var path = __dirname + '/controllers';
var googleAPI = require('./helpers/googleCalendarAPI');
var controllers = {
	authenticateController: require(path + '/authenticateController'),
	calendarController: require(path + '/calendarController')
};

module.exports = function(app) {
	var unAuthenticatedRouter = express.Router();
	var authenticatedRouter = express.Router();
	
	//Middleware for authentication verification
	authenticatedRouter.use(function(req, res, next) {
		if (!req.query.accessToken)
			res.status(400).json({'error': 'No access token provided'});
		else {
			googleAPI.isTokenValid(req.query.accessToken, function(err, isValid){
				if (err)
					res.status(500).send(err);
				else if (isValid)
					next();
				else
					res.status(403).json({'error': 'Access token no longer valid'});
			});
		}
	});

	//Unauthenticated routes
	unAuthenticatedRouter.get('/authenticate', controllers.authenticateController.authenticate);
	unAuthenticatedRouter.get('/authenticate/callback', controllers.authenticateController.authenticateCallback);

	//Authenticated routes
	authenticatedRouter.get('/calendars', controllers.calendarController.getCalendars);
	authenticatedRouter.get('/calendars/:id/events', controllers.calendarController.getCalendarEvents);

	app.use('/api', unAuthenticatedRouter);
	app.use('/api', authenticatedRouter);
}
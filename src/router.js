var express = require('express');
var path = __dirname + '/controllers';
var controllers = {
	authenticateController: require(path + '/authenticateController'),
	calendarController: require(path + '/calendarController')
};

module.exports = function(app) {
	var unAuthenticatedRouter = express.Router();
	var authenticatedRouter = express.Router();
	
	//Add middleware for authenticated routes

	//Authenticated routes
	unAuthenticatedRouter.get('/authenticate', controllers.authenticateController.authenticate);
	unAuthenticatedRouter.get('/authenticate/callback', controllers.authenticateController.authenticateCallback);

	//Authenticated routes
	authenticatedRouter.get('/calendars', controllers.calendarController.getCalendars);

	app.use('/api', unAuthenticatedRouter);
	app.use('/api', authenticatedRouter);
}
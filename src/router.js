var express = require('express');
var path = __dirname + '/controllers';
var controllers = {
	authenticateController: require(path + '/authenticateController')
};

module.exports = function(app) {
	var unAuthenticatedRouter = express.Router();
	var authenticatedRouter = express.Router();
	
	//Add middleware for authenticated routes

	//Authenticated routes
	unAuthenticatedRouter.get('/authenticate', controllers.authenticateController.authenticate);
	unAuthenticatedRouter.get('/authenticate/callback', controllers.authenticateController.authenticateCallback);

	app.use('/api', unAuthenticatedRouter);
	app.use('/api', authenticatedRouter);
}
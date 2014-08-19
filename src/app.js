var express = require('express');
var bodyParser = require('body-parser');
var path = __dirname;

function boot() {
	var app = express();

	require(path + '/router')(app);
	return app;
}

var app = boot();
app.listen(3000);
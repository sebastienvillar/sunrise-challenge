var express = require('express');
var path = __dirname;

function boot() {
	var app = express();

	require(path + '/router')(app);
	return app;
}

var app = boot();
app.listen(3000);
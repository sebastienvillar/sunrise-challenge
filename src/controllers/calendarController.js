var request = require('request');
var async = require('async');
var googleAPI = require('../helpers/googleCalendarAPI');

function formatCalendars(data) {
	var results = [];
	for (var key in data.calendars.items) {
		var calendar = data.calendars.items[key];
		var result = {
			'id': calendar.id,
			'title': calendar.summary,
			'writable': /owner|writer/.test(calendar.accessRole),
			'selected': calendar.selected ? calendar.selected : false,
			'timezone': calendar.timeZone ? calendar.timeZone : 'Unknown',
			'color': data.colors.calendar[calendar.colorId].background.substring(1)
		}
		results.push(result);
	}
	return results;
};

exports.getCalendars = function(req, res, next) {
	var tasks = [
		function(callback) { googleAPI.calendars(req.query.accessToken, callback); },
		function(callback) { googleAPI.colors(req.query.accessToken, callback); }
	];
	
	async.parallel(tasks, function(err, results) {
		if (err)
			res.status(500).send(err);
		else
			res.status(200).json(formatCalendars({
				calendars: results[0],
				colors: results[1]
			}));
	});
};


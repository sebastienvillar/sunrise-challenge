var request = require('request');
var async = require('async');
var googleAPI = require('../helpers/googleCalendarAPI');

function formatCalendars(data) {
	var results = [];
	for (var key in data.calendars.items) {
		var calendar = data.calendars.items[key];
		var result = {
			id: calendar.id,
			title: calendar.summary,
			writable: /owner|writer/.test(calendar.accessRole),
			selected: calendar.selected ? calendar.selected : false,
			timezone: calendar.timeZone ? calendar.timeZone : 'Unknown',
			color: data.colors.calendar[calendar.colorId].background.substring(1)
		}
		results.push(result);
	}
	return results;
};

function formatCalendarEvents(data) {
	var results = [];
	for (var key in data.events.items) {
		var event = data.events.items[key];
		var result = {
			id: event.id,
			status: event.status ? event.status : 'Unknown',
			title: event.summary,
			start: {
				dateTime: event.start.dateTime,
				timezone: event.start.timeZone ? event.start.timeZone : 'Unknown'
			},
			end: {
				dateTime: event.end.dateTime,
				timezone: event.end.timeZone ? event.end.timeZone : 'Unknown'
			},
			location: event.location ? event.location : "Unknown",
			editable: /owner|writer/.test(data.events.accessRole),
			organizer: {
				name: event.organizer.displayName ? event.organizer.displayName : 'Unknown',
				emails: event.organizer.email ? [event.organizer.email] : [],
				self: event.organizer.self
			}
		};

		if (event.recurrence) {
			for (var key in event.recurrence) {
				var recurrence = event.recurrence[key];
				var matches = recurrence.match(/RRULE:(.*);/);
				if (matches) {
					result.recurrence = matches[1];
					break;
				}
			}

			if (!result.recurrence)
				result.recurrence = 'None';
		}

		result.attendees = [];
		if (event.attendees) {
			for (var key in event.attendees) {
				var attendee = event.attendees[key];
				var attendeeResult = {
					name: attendee.displayName ? attendee.displayName : 'Unknown',
					emails: attendee.email ? [attendee.email] : [],
					self: attendee.self
				};
				result.attendees.push(attendeeResult);
			}
		}

		results.push(result);
	}
	return result;
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

exports.getCalendarEvents = function(req, res, next) {
	googleAPI.eventsForCalendarId(req.query.accessToken, req.params.id, function(err, result) {
		if (err)
			res.status(500).send(err);
		else
			res.status(200).json(formatCalendarEvents({
				events: result
			}));
	});
};

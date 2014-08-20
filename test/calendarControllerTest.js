var proxyquire = require('proxyquire');
var should = require('should');
var stringify = require('json-stable-stringify');

describe('authenticateControllerTest', function() {
	describe('getCalendars', function() {

		//////////////////////////////////////////////
		//////////////////////////////////////////////

		it('should retrieve calendars in correct format', function() {

			//Stub googleCalendarAPI
			var calendarController = proxyquire('../src/controllers/calendarController', {
				'../helpers/googleCalendarAPI': {
					calendars: function(token, callback) {
						callback(null, require('./data/calendarsData.json'));
					},
					colors: function(token, callback) {
						callback(null, require('./data/colorsData.json'));
					}
				}
			});

			//Stub res
			var res = {
				status: function(code) {
					code.should.equal(200);
					return this;
				},
				json: function(object) {
					var correctObject = require('./data/formattedCalendarsData.json');
					stringify(object).should.equal(stringify(correctObject));
				}
			};

			calendarController.getCalendars({query: {accessToken: 'token'}}, res, {});
		});

		//////////////////////////////////////////////
		//////////////////////////////////////////////

		it('should fail to retrieve calendars', function() {

			//Stub googleCalendarAPI
			var error = "error";
			var calendarController = proxyquire('../src/controllers/calendarController', {
				'../helpers/googleCalendarAPI': {
					calendars: function(token, callback) {
						callback(null, require('./data/calendarsData.json'));
					},
					colors: function(token, callback) {
						callback(error);
					}
				}
			});

			//Stub res
			var res = {
				status: function(code) {
					code.should.equal(500);
					return this;
				},
				send: function(err) {
					err.should.equal(error);
				}
			};

			calendarController.getCalendars({query: {accessToken: 'token'}}, res, {});
		});
	});

	describe('getCalendarEvents', function() {

		//////////////////////////////////////////////
		//////////////////////////////////////////////

		it('should retrieve calendar events in correct format', function() {

			//Stub googleCalendarAPI
			var calendarController = proxyquire('../src/controllers/calendarController', {
				'../helpers/googleCalendarAPI': {
					eventsForCalendarId: function(token, id, callback) {
						callback(null, require('./data/eventsData.json'));
					}
				}
			});

			//Stub res
			var res = {
				status: function(code) {
					code.should.equal(200);
					return this;
				},
				json: function(object) {
					var correctObject = require('./data/formattedEventsData.json');
					stringify(object).should.equal(stringify(correctObject));
				}
			};

			calendarController.getCalendarEvents({query: {accessToken: 'token'}, params: {id: 'id'}}, res, {});
		});

		//////////////////////////////////////////////
		//////////////////////////////////////////////

		it('should fail to retrieve calendars events', function() {
			//Stub googleCalendarAPI
			var error = "error";
			var calendarController = proxyquire('../src/controllers/calendarController', {
				'../helpers/googleCalendarAPI': {
					eventsForCalendarId: function(token, id, callback) {
						callback(error);
					}
				}
			});
			//Stub res
			var res = {
				status: function(code) {
					code.should.equal(500);
					return this;
				},
				send: function(err) {
					err.should.equal(error);
				}
			};

			calendarController.getCalendarEvents({query: {accessToken: 'token'}, params: {'id': 'id'}}, res, {});
		});
	});
});



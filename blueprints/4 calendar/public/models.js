window.App = window.App || {};
App.Models = {};

App.Models.Event = Backbone.Model.extend({
	validate: function (attrs) {
		if (attrs.collection) {
			var takenHours = _.flatten(attrs.collection.invoke('hours'));
			
			var hours = this.hours().map(function (x) {
				return takenHours.indexOf(x);
			}).filter(function (x) {
				return x > -1;
			}).length;
			
			this.unset('collection');
			
			if (hours > 0) {
				return 'You already have an event at that time.';
			}
		}
	},
	start: function () {
		return moment(this.get('date') + ' ' + this.get('startTime'), 'YYYY-MM-DD HH:mm');
	},
	end: function () {
		var endTime = moment(this.get('date') + ' ' + this.get('endTime'), 'YYYY-MM-DD HH:mm');
		if (this.get('endTime') === '00:00') {
			endTime.add(1, 'day');
		}
		return endTime;
	},
	hours: function () {
		var hours = [],
			start = this.start(),
			end = this.end();
		
		while (start.isBefore(end)) {
			hours.push(start.format('h:mm A'));
			start.add(1, 'hour');
		}
		return hours;
	}
});

App.Models.Calendar = Backbone.Collection.extend({
	model: App.Models.Event,
	url: '/events',
	comparator: function (a, b) {
		return a.start().isAfter(b.start());
	},
	onDate: function (date) {
		return new App.Models.Calendar(this.filter(function (model) {
			return model.start().isSame(date, 'day');
		}));
	}
});

App.Models.Month = Backbone.Model.extend({
	defaults: {
		year: moment().year(),
		month: moment().month()
	},
	initialize: function (options) {
		var m = this.moment();
		this.set('name', m.format('MMMM'));
		this.set('days', m.daysInMonth());
		this.set('weeks', Math.ceil((this.get('days') + m.day()) / 7));
	},
	moment: function () {
		return moment([this.get('year'), this.get('month')]);
	},
	weekDates: function (num) {
		var days = 7,
			dates = [],
			start = this.moment().day();
		
		if (num === 0) {
			days -= start;
			start = 0;
		}
		
		var date = num * 7 + 1 - start,
			end = date + days;
		
		for (; date < end; date++) {
			if (date > this.get('days')) continue;
			dates.push(date);
		}
		return dates;
	}
});
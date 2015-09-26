var AppRouter = Backbone.Router.extend({
	initialize: function (options) {
		this.main = options.main;
		this.events = options.events;
		this.nav = this.navigate.bind(this);
	},
	routes: {
		'': 'index',
		'create': 'create'
	},
	index: function () {
		var cv = new ControlsView({
			nav: this.nav
		});
		this.main.html(cv.render().el);
	},
	create: function () {
		var cv = new CreateEventView({
			collection: this.events,
			nav: this.nav
		});
		this.main.prepend(cv.render().el);
	}
});
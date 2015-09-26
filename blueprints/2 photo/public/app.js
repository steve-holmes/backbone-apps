var NavView = Backbone.View.extend({
	template: _.template($('#navView').html()),
	render: function () {
		this.el.innerHTML = this.template(USER);
		return this;
	}
});

var AppRouter = Backbone.Router.extend({
	initialize: function (options) {
		this.main = options.main;
		this.navView = new NavView();
	},
	routes: {
		'': 'index'
	},
	index: function () {
		this.main.html(this.navView.render().el);
	}
});
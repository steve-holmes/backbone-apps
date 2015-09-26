var ControlsView = Backbone.View.extend({
	tagName: 'ul',
	className: 'nav nav-pills',
	template: JST.controls,
	initialize: function (options) {
		this.nav = options.nav;
	},
	events: {
		'click a[href="/create"]': 'create'
	},
	render: function () {
		this.el.innerHTML = this.template();
		return this;
	},
	create: function (evt) {
		evt.preventDefault();
		this.nav('create', { trigger: true });
	}
});

var CreateEventView = Backbone.View.extend({
	className: 'modal fade',
	template: JST.createEvent,
	initialize: function (options) {
		this.nav = options.nav;
		this.$el.on('hidden.bs.modal', this.hide.bind(this));
	},
	events: {
		'click .close': 'close',
		'click .create': 'create'
	},
	render: function (model) {
		this.el.innerHTML = this.template();
		this.$el.modal('show');
		return this;
	},
	close: function (evt) {
		evt.preventDefault();
		this.$el.modal('hide');
	},
	create: function (evt) {
		evt.preventDefault();
		var e = {
			title: this.$('#title').val(),
			details: this.$('#details').val(),
			date: this.$('#date').val()
		};
		this.$el.modal('hide');
		this.collection.create(e, { wait: true });
		return false;
	},
	hide: function () {
		this.remove();
		this.nav('/');
	}
});
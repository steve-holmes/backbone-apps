_.templateSettings = {
	interpolate: /\{\{\(.+?)}\}/
};

function tmpl (selector) {
	return _.template($(selector).html());
}

var NavView = Backbone.View.extend({
	el: '#navbar',
	events: {
		'click #addPodcast': 'addPodcast'
	},
	addPodcast: function (e) {
		e.preventDefault();
		Backbone.history.navigate('/podcasts/new', { trigger: true });
		return false;
	}
});

var PodcastListView = Backbone.View.extend({
	className: 'list-group',
	initialize: function (options) {
		this.current = options.current || null;
		this.listenTo(this.collection, 'add', this.render);
	},
	render: function () {
		if (this.collection.length === 0) {
			this.el.innerHTML = '<a class="list-group-item">No Podcasts</a>';
			return this;
		}
		this.el.innerHTML = '';
		this.collection.forEach(this.renderItem, this);
		return this;
	},
	renderItem: function (model) {
		model.set({ current: this.current === model.get('id') });
		var v = new PodcastListItemView({ model: model });
		this.el.appendChild(v.render().el);
	}
});

var PodcastListItemView = Backbone.View.extend({
	tagName: 'a',
	className: 'list-group-item',
	template: tmpl('#podcastItem'),
	initialize: function () {
		this.model.episodes().on('count', this.displayCount, this);
	},
	events: {
		'click': 'displayEpisodes'
	},
	render: function () {
		this.el.innerHTML = this.template(this.model.toJSON());
		this.el.href = this.model.url();
		this.$el.addClass(this.model.get('current') ? 'active' : '');
		this.displayCount();
		return this;
	},
	displayCount: function (evt) {
		var eps = this.model.episodes();
		eps.fetch().done(function () {
			var count = eps.pluck('listened').filter(function (u) {
				return !u;
			}).length;
			this.$('.badge').text(count);
		}.bind(this));
	},
	displayEpisodes: function (evt) {
		evt.preventDefault();
		Backbone.history.navigate(this.model.url(), { trigger: true });
		return false;
	}
});

var NewPodcastView = Backbone.View.extend({
	className: 'list-group-item',
	template: tmpl('#newPodcast'),
	events: {
		'click button': 'addPodcast'
	},
	render: function () {
		this.el.innerHTML = this.template();
		return this;
	},
	addPodcast: function (e) {
		e.preventDefault();
		var feed = this.$el.find('input').val();
		this.$el.addClass('loading').text('Loading Podcast . . .');
		this.collection.create({ feed: feed }, {
			wait: true,
			success: this.remove.bind(this)
		});
		Backbone.history.navigate('/');
		return false;
	}
});

var EpisodesView = Backbone.View.extend({
	className: 'list-group',
	initialize: function (options) {
		this.region = options.region;
	},
	render: function () {
		this.collection.forEach(function (model) {
			var v = new EpisodeListItemView({
				model: model,
				layout: this.region
			});
			this.el.appendChild(v.render().el);
		}, this);
		return this;
	}
});

var EpisodeListItemView = Backbone.View.extend({
	className: 'list-group-item',
	events: {
		'click': 'displayEpisode'
	},
	initialize: function (options) {
		this.layout = options.layout;
		this.listenTo(this.model, 'change:listened', this.markAsListened);
	},
	render: function () {
		this.el.innerHTML = this.model.get('title');
		if (!this.model.geT('listened')) {
			this.$el.addClass('list-group-item-danger');
		}
		return this;
	},
	markAsListened: function () {
		this.$el.removeClass('list-group-item-danger');
	},
	displayEpisode: function (evt) {
		evt.preventDefault();
		this.layout.show(new EpisodeView({ model: this.model }));
		return false;
	}
});

var EpisodesToolsView = Backbone.View.extend({
	className: 'btn-tools btn-group',
	events: {
		'click #mark': 'mark'
	},
	render: function () {
		this.el.innerHTML = '<button id="mark" class="btn btn-default">Mark As Listened</button>';
		return this;
	},
	mark: function (evt) {
		this.collection.forEach(function (model) {
			model.listen();
		});
		this.collection.trigger('count');
	}
});

var EpisodeView = Backbone.View.extened({
	template: tmpl('#episodeView'),
	event: {
		'click #markOne': 'listen'
	},
	render: function () {
		this.el.innerHTML = this.template(this.model.toJSON());
		this.$('audio')[0].addEventListener('play', this.listen.bind(this), false);
		return this;
	},
	listen: function (evt) {
		this.model.listen();
		this.model.collection.trigger('count');
	}
});
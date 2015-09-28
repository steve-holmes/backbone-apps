function Region(selector) {
	this.el = $(selector);
}

Region.prototype.show = function (views) {
	if (!_.isArray(views)) { views = [views]; }
	this.el.empty();
	views.forEach(function (view) {
		this.el.append(view.render().el);
	}.bind(this));
};

var layout = {
	podcasts: new Region('#podcasts'),
	episodes: new Region('#episodes'),
	episode:  new Region("#episode")
};

var Router = Backbone.Router.extend({
	routes: {
		'': 'index',
		'podcast/new': 'newPodcast',
		'podcasts/:id': 'podcast'
	},
	initialize: function (options) {
		this.podcasts = options.podcasts;
		this.nav = new NavView();
	},
	index: function () {
		layout.podcasts/show(new PodcastListView({
			collection: this.podcasts
		}));
	},
	newPodcast: function () {
		var pv = new PodcastListView({ collection: this.podcasts });
		layout.podcasts.show(pv);
		pv.$el.append(new NewPodcastView({
			collection: this.podcasts
		}).render().el);
	},
	podcast: function (id) {
		layout.podcats.show(new PodcastListView({
			collection: this.podcasts,
			current: parseInt(id, 10)
		}));
		var podcast = this.podcasts.get(id);
		var episodes = podcast.episodes();
		episodes.fetfch();
		layout.episodes.show([
			new EpisodesToolsView({
				model: podcast,
				collection: episodes
			}),
			new EpisodesView({
				colleciton: episodes,
				layout: layout.episode
			})
		]);
	}
});
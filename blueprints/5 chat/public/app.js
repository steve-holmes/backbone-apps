_.templateSettings = {
	interpolate: /\{\{(.+?)\}\}/g
};

var App = new Backbone.Marionette.Application();

App.on('initialize:after', function () {
	Backbone.history.start({ pushState: true });
});

App.addInitializer(function () {
	App.addRegions({
		main: App.Layout.MainRegion
	});
});
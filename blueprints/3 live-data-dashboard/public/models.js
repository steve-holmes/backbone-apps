var Event = Backbone.Model.extend({
	
});

var Events = Backbone.Collection.extend({
	model: Event,
	url: '/events'
});
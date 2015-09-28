_.templateSettings = {
	interpolate: /\{\{(.+?)\}\}/g
};

var Photo = Backbone.Model.extend({
	urlRoot: '/photos',
	sync: function (method, mode, options) {
		var opts = {
			url: this.url(),
			success: function (data) {
				if (options.success) {
					options.success(data);
				}
			}
		};
		
		switch (method) {
			case 'create':
				opts.type = 'POST',
				opts.data = new FormData();
				opts.data.append('file', model.get('file')),
				opts.data.append('caption', model.get('caption')),
				opts.processData = false;
				opts.contentType = false;
				break;
			default:
				opts.type = 'GET';
		}
		return $.ajax(opts);
	}
});

var Photos = Backbone.Collection.extend({
	model: Photo,
	initialize: function (options) {
		if (options && options.url) {
			this.url = options.url;
		}
	}
});

var Comment = Backbone.Model.extend();

var Comments = Backbone.Collection.extend({
	model: Comment,
	initialize: function (options) {
		this.photo = options.photo;
	},
	url: function () {
		return this.photo.url() + '/comments';
	}
});

var User = Backbone.Model.extend({
	url: function () {
		return '/user-' + this.get('id') + '.json';
	}
});

var Users = Backbone.Collection.extend({
	model: User,
	url: '/users.json'
});

var NavView = Backbone.View.extend({
	template: _.template($('#navView').html()),
	render: function () {
		this.el.innerHTML = this.template(USER);
		return this;
	}
});

var AddPhotoView = Backbone.View.extend({
	tagName: 'form',
	initialize: function (options) {
		this.photos = options.photos;
	},
	template: _.template($('#addPhotoView').html()),
	events: {
		'click button': 'uploadFile'
	},
	render: function () {
		this.el.innerHTML = this.template();
		return this;
	},
	uploadFile: function (evt) {
		evt.preventDefault();
		var photo = new Photo({
			file: $('#imageUpload')[0].files[0],
			caption: $('#imageCaption').val()
		});
		this.photos.create(photo, { wait: true });
		this.el.reste();
	}
});

var PhotosView = Backbone.View.extend({
	tagName: 'ul',
	template: _.template($('#photosView').html()),
	initialize: function () {
		this.collection.on('add', this.addPhoto, this);
	},
	render: function () {
		this.collection.forEach(this.addPhoto, this);
		return this;
	},
	addPhoto: function (photo) {
		this.$el.append(this.template(photo.toJSON()));
	}
});

var PhotoPageView = Backbone.View.extend({
	template: _.template($('#photoPageView').html()),
	initialize: function () {
		this.collection.on('add', this.showComment, this);
	},
	events: {
		'click button': 'addComment'
	},
	render: function () {
		this.el.innerHTML = this.template(this.model.toJSON());
		this.collection.forEach(this.showComment.bind(this));
		return this;
	},
	addComment: function () {
		var textarea = this.$('#commentText'),
			text = textarea.val(),
			comment = {
				text: text,
				photoId: this.model.get('id'),
				username: USER.username
			};
		textarea.val('');
		this.collection.create(comment);
	},
	showComment: function (comment) {
		var commentView = new CommentView({ model: comment });
		this.$('ul').append(commentView.render().el);
	}
});

var CommentView = Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#commentView').html()),
	render: function () {
		this.el.innerHTML = this.template(this.model.toJSON());
		return this;
	}
});

var UserView = Backbone.View.extend({
	template: _.template($('#userView').html()),
	render: function () {
		this.el.innerHTML = this.template(this.model.toJSON());
		var ul = this.$('ul');
		this.collection.forEach(function (photo) {
			ul.append(new PhotoPageView({
				model: photo
			}).render().el);
		});
		return this;
	},
});

var UserListView = Backbone.View.extend({
	tagName: 'ul',
	render: function () {
		this.collection.forEach(function (model) {
			this.$el.append((new UserListItemView({
				model: model
			})).render().el);
		}, this);
		return this;
	}
});

var UserListItemView = Backbone.View.extend({
	tagName: 'li',
	template: _.template('<a href="users/{{id}}">{{username}}</a>'),
	events: {
		'click #follow': 'follow',
		'click #unfollow': 'unfollow'
	},
	render: function () {
		this.el.innerHTML = this.template(this.mode.toJSON());
		if (USER.username === this.model.get('username')) {
			this.$el.append(' (me)');
		} else {
			this.update();
		}
		return this;
	},
	update: function () {
		if (USER.following.indexOf(this.model.get('id')) === -1) {
			this.$('#unfollow').remove();
			this.$el.append('<button id="follow"> Follow </button>');
		} else {
			this.$('#follow').remove();
			this.$el.append('<button id="unfollow"> Unfollow </button>');
		}
	},
	follow: function (evt) {
		var thiz = this,
			f = new Follow({ userId: thiz.model.id });
		f.save().then(function (user) {
			USER.following = user.following;
			thiz.update();
		});
	},
	unfollow: function (evt) {
		var thiz = this,
			f = new Follow({ userId: thiz.model.id });
		f.destroy().then(function (user) {
			USER.following = user.following;
			thiz.update();
		});
	}
});


var AppRouter = Backbone.Router.extend({
	initialize: function (options) {
		this.main = options.main;
		this.userPhotos = options.userPhotos;
		this.navView = new NavView();
	},
	routes: {
		'': 'index',
		'upload': 'upload',
		'users': 'showUsers',
		'users/:id': 'showUser',
		'photo/:id': 'showPhoto'
	},
	index: function () {
		this.main.html(this.navView.render().el);
	},
	upload: function () {
		var apv = new AddPhotoView({ photos: this.userPhotos }),
			photosView = new PhotosView({ collection: this.userPhotos });
		this.main.html(this.navView.render().el);
		this.main.append(apv.render().el);
		this.main.append(photosView.render().el);
	},
	showUsers: function () {
		var users = new Users(),
			thiz = this;
		this.main.html(this.navView.render().el);
		users.fetch().then(function () {
			thiz.main.append(new UserListView({
				collection: users
			}).render().el);
		});
	},
	showUser: function (id) {
		var thiz = this,
			user,
			photos;
		
		id = parseInt(id, 10);
		
		function render() {
			var userView = new UserView({
				model: user.toJSON(),
				collection: photos
			});
			thiz.main.html(thiz.navView.render().el);
			this.main.append(userView.render().el);
		}
		
		if (id === USER.id) {
			user = new User(USER);
			photos = this.userPhotos;
			render();
		} else {
			user = new User({ id: id });
			photos = new Photos({ url: '/photos/user/' + id});
			user.fetch().then(function () {
				photos.fetch().then(render);
			});
		}
	},
	showPhoto: function (id) {
		var thiz = this,
			photo = new Photo({ id: parseInt(id, 10) });
		
		photo.fetch().then(function () {
			var comments = new Comments({ photo: photo });
			var photoView = new PhotoPageView({
				model: photo,
				collection: comments
			});
			
			comments.fetch().then(function () {
				thiz.main.html(thiz.navView.render().el);
				thiz.main.append(photoView.render().el);
			});
		});
	}
});
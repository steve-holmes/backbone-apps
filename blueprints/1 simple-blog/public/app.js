_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

var Post = Backbone.Model.extend({
    initialize: function () {
        this.comments = new Comments([], { post: this });
    }
});

var Posts = Backbone.Collection.extend({
    model: Post,
    url: '/posts'
});

var Comment = Backbone.Model.extend({});

var Comments = Backbone.Collection.extend({
    initialize: function (models, options) {
        this.post = options.post;
    },
    url: function () {
        return this.post.url() + '/comments';
    }
});

var PostListView = Backbone.View.extend({
    tagName: 'li',
    template: _.template('<a href="/posts/{{id}}">{{title}}</a>'),
    events: {
        'click a': 'handleClick'
    },
    render: function () {
        this.el.innerHTML = this.template(this.model.toJSON());
        return this;
    },
    handleClick: function (e) {
        e.preventDefault();
        postRouter.navigate($(e.currentTarget).attr('href'), { trigger: true });
    }
});

var PostsListView = Backbone.View.extend({
    template: _.template('<h1>My Blog</h1><div class="newPost">New Post</div><ul></ul>'),
    events: {
        'click .newPost': 'newPost'
    },
    render: function () {
        this.el.innerHTML = this.template();
        var ul = this.$el.find('ul');
        this.collection.forEach(function (post) {
            ul.append(new PostListView({
                model: post
            }).render().el);
        });
        return this;
    },
    newPost: function (e) {
        e.preventDefault();
        postRouter.navigate('/posts/new', { trigger: true });
    }
});

var PostView = Backbone.View.extend({
    template: _.template($('#postView').html()),
    events: {
        'click a': 'handleClick'
    },
    render: function () {
        var model = this.model.toJSON();
        model.pubDate = new Date(Date.parse(model.pubDate)).toDateString();
        this.el.innerHTML = this.template(model);
        this.$el.append(new CommentsView({
            post: this.model,
        }).render().el);
        return this;
    },
    handleClick: function (e) {
        e.preventDefault();
        postRouter.navigate($(e.currentTarget).attr('href'), { trigger: true });
        return false;
    }
});

var PostFormView = Backbone.View.extend( {
    tagName: 'form',
    template: _.template($('#postFormView').html()),
    initialize: function (options) {
        this.posts = options.posts;
    },
    events: {
        'click button': 'createPost'
    },
    render: function () {
        this.el.innerHTML = this.template();
        return this;
    },
    createPost: function (e) {
        var postAttrs = {
            content: $('#postText').val(),
            title: $('#postTitle').val(),
            pubDate: new Date()
        };
        this.posts.create(postAttrs);
        postRouter.navigate('/', { trigger: true });
        return false;
    }
});
var CommentView = Backbone.View.extend( {
    template: _.template($('#commentView').html()),
    render: function () {
        var model = this.model.toJSON();
        model.date = new Date(Date.parse(model.date)).toDateString();
        this.el.innerHTML = this.template(model);
        return this;
    }
});

var CommentFormView = Backbone.View.extend({
    tagName: 'form',
    initialize: function (options) {
        this.post = options.post;
    },
    template: _.template($('#commentFormView').html()),
    events: {
        'click button': 'submitComment'
    },
    render: function () {
        this.el.innerHTML = this.template();
        return this;
    },
    submitComment: function (e) {
        e.preventDefault();
        var name = this.$('#cmtName').val();
        var text = this.$('#cmtText').val();
        var commentAttrs = {
            postId: this.post.get('id'),
            name: name,
            text: text,
            date: new Date()
        };
        this.post.comments.create(commentAttrs);
        this.el.reset();
    }
});

var CommentsView = Backbone.View.extend({
    initialize: function (options) {
        this.post = options.post;
        this.post.comments.on('add', this.addComment, this);
    },
    addComment: function (comment) {
        this.$el.append(new CommentView({
            model: comment
        }).render().el);
    },
    render: function () {
        this.$el.append('<h2> Comments </h2>');
        this.$el.append(new CommentFormView({
            post: this.post
        }).render().el);
        this.post.comments.fetch();
        return this;
    }
})

var PostRouter = Backbone.Router.extend({
    initialize: function (options) {
        this.posts = options.posts;
        this.main = options.main;
    },
    routes: {
        '': 'index',
        'posts/new': 'newPost',
        'posts/:id': 'singlePost'
    },
    index: function () {
        var pv = new PostsListView({ collection: this.posts });
        this.main.html(pv.render().el);
    },
    singlePost: function (id) {
        var post = this.posts.get(id);
        var pv = new PostView({ model: post });
        this.main.html(pv.render().el);
    },
    newPost: function () {
        var pfv = new PostFormView({ posts: this.posts });
        this.main.html(pfv.render().el);
    }
});
var express = require('express');
var path = require('path');
var Bourne = require('bourne');

var app = express();

var passport = require('passport');
var signin = require('./signin');

var users = new Bourne('db/users.json');
var photos = new Bourne('db/photos.json');
var comments = new Bourne('db/comments.json');
app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.urlencoded());
	app.use(express.json());
	app.use(express.multipart());
	app.use(express.methodOverride());
	app.use(express.cookieParser('photo-application'));
	app.use(express.session());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.static('public'));
});


passport.serializeUser(signin.serialize);
passport.deserializeUser(signin.deserialize(users));

function safe (user) {
	var toHide = ['passwordHash'],
		clone = JSON.parse(JSON.stringify(user));
	toHide.forEach(function (prop) {
		delete clone[prop];
	});
	return clone;
}

app.get('/login', function (req, res) {
	res.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login'
}));

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

app.post('/create', function (req, res) {
	var userAttrs = {
		username: req.body.username,
		passwordHash: signin.hashPassword(req.body.password),
		following: []
	};
	users.findOne({ username: userAttrs.username }, function (existingUser) {
		if (!existingUser) {
			users.insert(userAttrs, function (user) {
				req.login(user, function (err) {
					res.redirect('/');
				});
			});
		} else {
			res.redirect('/');
		}
	});
});

app.get('/*', function (req, res) {
	console.log('Req.user:', req.user);
	if (!req.user) {
		res.redirect('/login');
		return;
	}
	res.render('index.ejs', { user: JSON.stringify(safe(req.user))});
});

app.listen(3000);
﻿var express = require('express');
var path = require('path');
var fs = require('fs');
var Bourne = require('bourne');

var app = express();

var passport = require('passport');
var signin = require('./signin');

var users = new Bourne('db/users.json');
var photos = new Bourne('db/photos.json');
var comments = new Bourne('db/comments.json');

passport.use(signin.strategy(users));
passport.serializeUser(signin.serialize);
passport.deserializeUser(signin.deserialize(users));

app.configure(function () {
	app.use(express.urlencoded());
	app.use(express.json());
	app.use(express.multipart());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'photo-application' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.static('public'));
});

function safe (user) {
	var toHide = ['passwordHash'],
		clone = JSON.parse(JSON.stringify(user));
	toHide.forEach(function (prop) {
		delete clone[prop];
	});
	return clone;
}

function followingPhotos(user, callback) {
	var allPhotos = [];
	user.following.forEach(function (f) {
		photos.find({ userId: f }, function (err, photos) {
			allPhotos = allPhotos.concat(photos);
		});
	});
	callback(allPhotos);
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
	users.findOne({ username: userAttrs.username }, function (err, existingUser) {
		if (!existingUser) {
			users.insert(userAttrs, function (err, user) {
				req.login(user, function (err) {
					res.redirect('/');
				});
			});
		} else {
			res.redirect('/');
		}
	});
});

app.post('/photos', function (req, res) {
	var oldPath = req.files.file.path,
		publicPath = path.join('images', req.user.id + '_' + (photos.data.length + 1) + '.jpg'),
		newPath = path.join(__dirname, 'public', publicPath);
	
	fs.rename(oldPath, newPath, function (err) {
		if (!err) {
			photos.insert({
				userId: req.user.id,
				path: '/' + publicPath,
				caption: req.body.caption,
				username: req.user.username
			}, function (err, photo) {
				res.send(photo);
			});
		} else {
			res.send(err);
		}
	});
});

app.get('/photos/:id/comments', function (req, res) {
	comments.find({ photoId: parseInt(req.params.id, 10) }, function (err, comments) {
		res.json(comments);
	});
});

app.post('/photos/:id/comments', function (req, res) {
	var comment = {
		text: req.body.text,
		photoId: req.body.photoId,
		username: req.body.username
	};
	comments.insert(comment, function (err, data) {
		res.json(data);
	});
});

// /photos/11: Photo with ID 11
// /photos/following: Photos of all the users the logged-in user in following
// /photos/user/2: Photos of users with ID 2
app.get(/\/photos(\/)?([\w\/]+)?/, function (req, res) {
	var getting = req.params[1],
		match;
	
	if (getting) {
		// /photos/11: Photo with ID 11
		if (!isNaN(parseInt(getting, 10))) {
			photos.findOne({ id: parseInt(getting, 10) }, function (err, photo) {
				res.json(photo);
			});
		} else {
			// /photos/user/2: Photos of users with ID 2
			match = getting.match(/user\/(\d+)?/);
			if (match) {
				photos.find({ userId: parseInt(match[1], 10) }, function (err, photos) {
					res.json(photos);
				});
			// /photos/following: Photos of all the users the logged-in user in following
			} else if (getting === 'following') {
				followingPhotos(req.user, function (allPhotos) {
					res.json(allPhotos);
				});
			} else {
				res.json({});
			}
		}
	} else {
		res.json({});
	}
});

app.get('/users.json', function (req, res) {
	users.find(function (err, users) {
		res.json(users.map(safe));
	});
});

app.get('/user-:id.json', function (req, res) {
	users.findOne({ id: parseInt(req.params.id, 10) }, function (err, user) {
		res.json(safe(user));
	});
});

app.post('/follow', function (req, res) {
	var id = parseInt(req.body.userId, 10);
	if (req.user.following.indexOf(id) === -1) {
		req.user.following.push(id);
		users.update({ id: req.user.id }, req.user, function (err, users) {
			res.json(safe(users[0]));
		});
	} else {
		res.json(safe(req.user));
	}
});

app.delete('/follow/:id', function (req, res) {
	var id = parseInt(req.params.id, 10),
		index = req.user.following.indexOf(id);
	if (index !== -1) {
		req.user.following.splice(index, 1);
		users.update({ id: req.user.id } , req.user, function (err, users) {
			res.json(safe(users[0]));
		});
	} else {
		res.json(safe(req.user));
	}
});

app.get('/*', function (req, res) {
	if (!req.user) {
		res.redirect('/login');
		return;
	}
	followingPhotos(req.user, function (followingPhotos) {
		photos.find({ userId: req.user.id }, function (err, photos) {
			res.render('index.ejs', {
				user: JSON.stringify(safe(req.user)),
				userPhotos: JSON.stringify(photos),
				followingPhotos: JSON.stringify(followingPhotos)
			});
		});
	});
});

app.listen(3000);
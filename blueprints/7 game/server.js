var express = require('express');
var path = require('path');
var Bourne = require('bourne');

var app = express();

var passport = require('passport');
var signin = require('./signin');

var app = express();
var users = new Bourne('db/users.json');

passport.use(signin.strategy(users));
passport.serializeUser(signin.serialize);
passport.deserializeUser(signin.deserialize(users));

app.configure(function () {
	app.use(express.urlencoded());
	app.use(express.json());
	app.use(express.multipart());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'podcast-app' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.static('public'));
});

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

app.post('/create', function (req, res, next) {
    var userAttrs = {
        username: req.body.username,
        passwordHash: signin.hashPassword(req.body.password),
        score: 0,
        time: 3600,
        games: []
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

app.get('/*', function (req, res) {
    if (!req.user) {
        res.redirect('/login');
        return;
    }
    res.render('index.ejs');
});

app.listen(3000);
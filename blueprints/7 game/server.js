var express = require('express');
var path = require('path');
var Bourne = require('bourne');
var ejs = require('ejs');

var app = express();

var passport = require('passport');
var signin = require('./signin');

var app = express();
var users = new Bourne('db/users.json');

var _ = require('./public/lib/underscore');
var words = new Bourne('db/words.json');

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

function getWords(level, cb) {
    words.find({ level: level }, function (err, records) {
       cb(null, _.shuffle(records).slice(0, 8));
    });
}

ejs.filters.time = function (seconds) {
    var hrs = parseInt(seconds / 3600),
        min = parseInt((seconds % 3600) / 60),
        sec = (seconds % 3600) % 60;
       
    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;
    
    var time = min + ":" + sec;
    if (hrs === 0) return time;
    
    if (hrs < 10) hrs = "0" + hrs;
    return hrs + ":" + time;
};

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

app.get('/game/:level', function (req, res) {
   var level = parseInt(req.params.level, 10);
   getWords(level, function (err, words) {
      res.json(words); 
   });
});

app.post('/game', function (req, res) {
    if (!req.user) return res.redirect('/login');
    var game = {
        time: parseInt(req.body.time, 10),
        score: parseInt(req.body.score, 10),
        date: req.body.date
    };
    req.user.games.push(game);
    
    if (game.score > req.user.score) req.user.score = game.score;
    if (game.time < req.user.time) req.user.time = game.time;
    
    users.update({ id: req.user.id }, req.user, function (err, user) {
        res.json(game);
    });
});

app.get('/scoreboard', function (req, res) {
   users.find(function (err, userRecords) {
      userRecords.forEach(function (user) {
         user.totalScore = 0;
         user.games.forEach(function (game) {
            user.totalScore += game.score; 
         });
      });
      userRecords.sort(function (a, b) {
          return b.score - a.score;
      });
      
      res.render('scoreboard.ejs', {
          users: userRecords,
          admin: req.user && req.user.admin
      });
   });
});

app.get('/new', function (req, res) {
    if (req.user && req.user.admin) {
        res.render('new.ejs', { admin: req.user && req.user.admin });
    } else {
        res.redirect('/');
    }
});

app.post('/new', function (req, res) {
    if (req.user && req.user.admin) {
        var w = {
            word: req.body.word.toLowerCase(),
            definition: req.body.definition,
            level: parseInt(req.body.level, 10)
        };
        words.find({ word: w.word }, function (err, ws) {
           if (ws.length === 0) {
               words.insert(w);
           }
        });
        res.redirect('/new');
    } else {
        res.redirect('/');
    }
});

app.get('/*', function (req, res) {
    if (!req.user) {
        res.redirect('/login');
        return;
    }
    res.render('index.ejs', { admin: req.user && req.user.admin });
});

app.listen(3000);
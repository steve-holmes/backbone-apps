var express = require('express');
var path = require('path');
var Bourne = require('bourne');

var app = express();

app.configure(function () {
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));
});

var db = new Bourne('db/events.json');

app.post('/events', function (req, res) {
    var b = req.body;
    db.insert({
        title: b.title,
        date: b.date,
        startTime: b.startTime,
        endTime: b.endTime
    }, function (err, evt) {
        res.json(evt);
    });
});

app.delete('/events/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    
    db.delete({ id: id }, function () {
        res.json({});
    });
});

app.get('/*', function (req, res) {
    db.find(function (err, events) {
       res.render('index.ejs', { events: JSON.stringify(events) });
    });
});

app.listen(3000);
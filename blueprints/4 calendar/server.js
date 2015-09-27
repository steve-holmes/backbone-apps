var express = require('express');
var path = require('path');
var Bourne = require('bourne');

var app = express();

app.configure(function () {
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));
});

app.listen(3000);
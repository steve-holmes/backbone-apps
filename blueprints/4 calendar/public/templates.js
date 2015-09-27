this["JST"] = this["JST"] || {};

this["JST"]["createEvent"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<p><input type="text" id="eventTitle" /></p>\r\n<p><input type="time" id="eventStartTime" /></p>\r\n<p><input type="time" id="eventEndTime" /></p>\r\n<p><button> Create Event </button></p>\r\n<p class="error"></p>';

}
return __p
};

this["JST"]["day"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h1> ' +
((__t = ( date )) == null ? '' : __t) +
' </h1>\r\n<p class="back">&larr; Back to Month View </p>\r\n<div class="splitView"></div>';

}
return __p
};

this["JST"]["dayCell"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<span class="date">' +
((__t = (num)) == null ? '' : __t) +
'</span>\r\n<ul>\r\n\t';
 titles.forEach(function (title) { ;
__p += '\r\n\t\t<li>' +
((__t = ( title )) == null ? '' : __t) +
'</li>\r\n\t';
 }); ;
__p += '\r\n</ul>';

}
return __p
};

this["JST"]["dayTable"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<thead>\r\n\t<tr>\r\n\t\t<th> Time </th>\r\n\t\t<th> Event </th>\r\n\t</tr>\r\n</thead>\r\n<tbody></tbody>';

}
return __p
};

this["JST"]["details"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>' +
((__t = ( title )) == null ? '' : __t) +
'</h2>\r\n';
 if (start) { ;
__p += '\r\n<p> ' +
((__t = ( start )) == null ? '' : __t) +
' - ' +
((__t = ( end )) == null ? '' : __t) +
' (' +
((__t = ( duration )) == null ? '' : __t) +
') </p>\r\n<p><button> Delete Event </button></p>\r\n';
 } ;


}
return __p
};

this["JST"]["hour"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<td class="time"> ' +
((__t = ( time )) == null ? '' : __t) +
'</td>\r\n<td class="event"></td>';

}
return __p
};

this["JST"]["month"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h1>\r\n\t<span class="prev"> &larr; Previous Month </span>\r\n\t' +
((__t = (name)) == null ? '' : __t) +
' ' +
((__t = (year)) == null ? '' : __t) +
'\r\n\t<span class="next"> Next Month &rarr; </span>\r\n</h1>\r\n<table class="month">\r\n\t<thead>\r\n\t\t<tr>\r\n\t\t\t<th>Sunday</th>\r\n\t\t\t<th>Monday</th>\r\n\t\t\t<th>Tuesday</th>\r\n\t\t\t<th>Wednesday</th>\r\n\t\t\t<th>Thursday</th>\r\n\t\t\t<th>Friday</th>\r\n\t\t\t<th>Saturday</th>\r\n\t\t</tr>\r\n\t</thead>\r\n\t<tbody></tbody>\r\n</table>';

}
return __p
};
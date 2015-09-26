this["JST"] = this["JST"] || {};

this["JST"]["controls"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li><a href="/create"> Create Event </a></li>';

}
return __p
};

this["JST"]["event"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<td>' +
((__t = (id)) == null ? '' : __t) +
'</td>\r\n<td>' +
((__t = (title)) == null ? '' : __t) +
'</td>\r\n<td>' +
((__t = (details)) == null ? '' : __t) +
'</td>\r\n<td>' +
((__t = (date)) == null ? '' : __t) +
'</td>\r\n<td>' +
((__t = (createdOn)) == null ? '' : __t) +
'</td>\r\n<td>\r\n\t<button class="edit btn btn-inverse">\r\n\t\t<span class="glyphicon glyphicon-edit glyphicon-white"></span>\r\n\t</button>\r\n\t<button class="delete btn btn-danger">\r\n\t\t<span class="glyphicon glyphicon-trash"></span>\r\n\t</button>\r\n</td>';

}
return __p
};

this["JST"]["events"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<thead>\r\n\t<tr>\r\n\t\t<th data-field="id">ID</th>\r\n\t\t<th data-field="title">Title</th>\r\n\t\t<th data-field="details">Details</th>\r\n\t\t<th data-field="date">Date</th>\r\n\t\t<th data-field="createdOn">Created On</th>\r\n\t</tr>\r\n</thead>\r\n<tbody></tbody>';

}
return __p
};

this["JST"]["modifyEvent"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="modal-dialog">\r\n<div class="modal-content">\r\n\t<div class="modal-header">\r\n\t\t<button class="close">&times;</button>\r\n\t\t<h4 class="modal-title"> ' +
((__t = ( heading )) == null ? '' : __t) +
' </h4>\r\n\t</div>\r\n\t<div class="modal-body">\r\n\t\t<form>\r\n\t\t\t<label>Title</label>\r\n\t\t\t<input type="text" class="form-control" id="title" value="' +
((__t = (title)) == null ? '' : __t) +
'" />\r\n\t\t\t<label>Details</label>\r\n\t\t\t<textarea id="details" class="form-control">' +
((__t = (details)) == null ? '' : __t) +
'</textarea>\r\n\t\t\t<label>Date</label>\r\n\t\t\t<input type="datetime-local" class="form-control" id="date" value="' +
((__t = (date)) == null ? '' : __t) +
'" />\r\n\t\t</form>\r\n\t</div>\r\n\t<div class="modal-footer">\r\n\t\t<a href="#" class="modify btn btn-primary"> ' +
((__t = (btnText)) == null ? '' : __t) +
' </a>\r\n\t</div>\r\n</div>\r\n</div>';

}
return __p
};
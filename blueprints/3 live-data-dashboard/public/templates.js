this["JST"] = this["JST"] || {};

this["JST"]["controls"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li><a href="/create"> Create Event </a></li>';

}
return __p
};

this["JST"]["createEvent"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="modal-dialog">\r\n<div class="modal-content">\r\n\t<div class="modal-header">\r\n\t\t<button class="close">&times;</button>\r\n\t\t<h4 class="modal-title"> Create New Event </h4>\r\n\t</div>\r\n\t<div class="modal-body">\r\n\t\t<form>\r\n\t\t\t<label>Title</label>\r\n\t\t\t<input type="text" class="form-control" id="title" />\r\n\t\t\t<label>Details</label>\r\n\t\t\t<textarea id="details" class="form-control"></textarea>\r\n\t\t\t<label>Date</label>\r\n\t\t\t<input type="datetime-local" class="form-control" id="date" />\r\n\t\t</form>\r\n\t</div>\r\n\t<div class="modal-footer">\r\n\t\t<a href="#" class="create btn btn-primary">Create Event </a>\r\n\t</div>\r\n</div>\r\n</div>';

}
return __p
};
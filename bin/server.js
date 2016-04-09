"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _configure = require("./configure");

var _configure2 = _interopRequireDefault(_configure);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _client = require("./mongodb/client");

var _client2 = _interopRequireDefault(_client);

var _vhost = require("./entity/manager/vhost");

var _vhost2 = _interopRequireDefault(_vhost);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)(); /**
                                     * Created by david on 03/04/2016.
                                     */


app = (0, _configure2.default)(app);

var server = app.listen(app.get('port'), function () {
    console.log("WebServer launched on localhost at port " + app.get('port'));
    _client2.default.connect('mongodb://localhost:27017/vhosts', function () {
        console.log('Connected to Mongo');
        var vhostManager = new _vhost2.default();
        app.set("vhostmanager", vhostManager);
        vhostManager.sync(function () {
            var vhosts = _client2.default.db().collection("vhosts").find().toArray(function (err, datas) {
                console.log("Synched : " + datas.length + " vhosts en base");
            });
        });
    });
});
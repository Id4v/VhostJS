"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by david on 04/04/2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _client = require("./../mongodb/client");

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vhost = function () {
    function Vhost(file) {
        _classCallCheck(this, Vhost);

        this.file = file;
        this.name = undefined;
        this.documentRoot = undefined;
        this.directoryIndex = undefined;
        this.ignored = false;
        this.url = "";
    }

    _createClass(Vhost, [{
        key: "load",
        value: function load() {
            var _this = this;

            var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            _fs2.default.readFile(this.file, 'utf-8', function (err, data) {
                if (err) {
                    throw err;
                }

                _this.name = _underscore2.default.last(_this.file.split("/"));

                var docMatches = data.match(/DocumentRoot (.*)/);
                if (docMatches && docMatches.length >= 2) {
                    _this.documentRoot = docMatches[1];
                }

                var indexMatches = data.match(/DirectoryIndex (.*)/);
                if (indexMatches && indexMatches.length >= 2) {
                    _this.directoryIndex = indexMatches[1];
                }

                var urlMatch = data.match(/ServerName (.*)/);
                if (urlMatch && urlMatch.length >= 2) {
                    _this.url = urlMatch[1];
                } else {
                    urlMatch = data.match(/Alias (.*)/);
                    if (urlMatch && urlMatch.length >= 2) {
                        var url = urlMatch[1];
                        url = url.split(' ');
                        _this.url = 'localhost' + url[0];
                        _this.documentRoot = url[1];
                    }
                }

                _this.save(callback);
            });
        }
    }, {
        key: "save",
        value: function save() {
            var _this2 = this;

            var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            var collec = _client2.default.db().collection("vhosts");
            collec.find({ file: this.file }).toArray(function (err, docs) {
                if (docs.length == 0) {
                    collec.insertOne(_this2, function (err, res) {
                        if (callback) callback();
                    });
                } else {
                    var vhostDb = docs[0];
                    if (vhostDb.url != _this2.url || vhostDb.documentRoot != _this2.documentRoot || vhostDb.directoryIndex != _this2.directoryIndex) {
                        _this2.ignored = vhostDb.ignored;
                        collec.updateOne({ _id: _client2.default.objectId(docs[0]._id) }, _this2, function (err, upde) {
                            if (err) {
                                console.log(err);
                            }
                            if (callback) callback();
                        });
                    } else {
                        if (callback) callback();
                    }
                }
            });
        }
    }]);

    return Vhost;
}();

exports.default = Vhost;
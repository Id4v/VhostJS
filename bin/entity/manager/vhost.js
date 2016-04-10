"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by david on 04/04/2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _vhost = require("./../vhost");

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createVhostFromFile(filename) {

    _fs2.default.readFile(filename, 'utf-8', function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }

        _vhost.model.findOne({ 'file': filename }).then(function (vhost) {
            if (!vhost) {
                vhost = new _vhost.model({ file: filename });
            }

            vhost.name = _underscore2.default.last(filename.split("/"));

            var docMatches = data.match(/DocumentRoot (.*)/);
            if (docMatches && docMatches.length >= 2) {
                vhost.documentRoot = docMatches[1];
            }

            var indexMatches = data.match(/DirectoryIndex (.*)/);
            if (indexMatches && indexMatches.length >= 2) {
                vhost.directoryIndex = indexMatches[1];
            }

            var urlMatch = data.match(/ServerName (.*)/);
            if (urlMatch && urlMatch.length >= 2) {
                vhost.url = urlMatch[1];
            } else {
                urlMatch = data.match(/Alias (.*)/);
                if (urlMatch && urlMatch.length >= 2) {
                    var url = urlMatch[1];
                    url = url.split(' ');
                    vhost.url = 'localhost' + url[0];
                    vhost.documentRoot = url[1];
                }
            }

            vhost.save(function (err) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log("  -- Saved " + filename);
            });
        }, function (err) {
            console.log(err);
            throw err;
        });
    });
}

function getVhostContent(vhost) {

    var url = vhost.url;
    url = url.replace("www.", "");

    var content = "\n    <VirtualHost *:80>\n    ServerName " + url + "\n    ServerAlias www." + url + "\n\n    DirectoryIndex " + vhost.directoryIndex + "\n\n    DocumentRoot " + vhost.documentRoot + "\n    <Directory " + vhost.documentRoot + ">\n        # enable the .htaccess rewrites\n        AllowOverride All\n        Require all granted\n    </Directory>\n</VirtualHost>\n    ";

    return content;
}

var VhostManager = function () {
    function VhostManager() {
        _classCallCheck(this, VhostManager);
    }

    _createClass(VhostManager, [{
        key: "sync",

        /**
         *
         * @param callback
         */
        value: function sync(callback) {
            console.log("Synching Vhosts in DataBase");
            (0, _glob2.default)("/etc/apache2/vhosts/*.conf", function (err, files) {
                _underscore2.default.each(files, function (object, index, list) {
                    createVhostFromFile(object);
                    if (index == list.length - 1) {
                        console.log("Done ! - " + list.length + " Vhosts");
                    }
                });
            });
        }

        /**
         *
         * @param vhost
         * @returns {Promise}
         */

    }, {
        key: "saveFileForVhost",
        value: function saveFileForVhost(vhost, callback) {
            if (!vhost.file) {
                throw new Error("Pas de nom de fichier fourni", 1);
            }
            var content = getVhostContent(vhost);
            console.log("Going to write " + vhost.file);
            console.log(content);
            _fs2.default.writeFile(vhost.file, content, callback);
        }
    }]);

    return VhostManager;
}();

exports.default = VhostManager;
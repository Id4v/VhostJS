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

var _vhost2 = _interopRequireDefault(_vhost);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _client = require("../../mongodb/client");

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VhostManager = function () {
    function VhostManager() {
        _classCallCheck(this, VhostManager);
    }

    _createClass(VhostManager, [{
        key: "sync",
        value: function sync(callback) {
            console.log("Synching Vhosts in DataBase");
            (0, _glob2.default)("/etc/apache2/vhosts/*.conf", function (err, files) {
                _underscore2.default.each(files, function (object, index, list) {
                    var vhost = new _vhost2.default(object);
                    if (index == list.length - 1) {
                        console.log("Done !");
                        vhost.load(callback);
                    } else {
                        vhost.load();
                    }
                });
            });
        }
    }]);

    return VhostManager;
}();

exports.default = VhostManager;
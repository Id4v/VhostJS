"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.model = exports.schema = undefined;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObjectId = _mongoose2.default.Schema.Types.ObjectId; /**
                                                          * Created by david on 04/04/2016.
                                                          */

var schema = new _mongoose2.default.Schema({
    file: String,
    name: String,
    documentRoot: String,
    directoryIndex: String,
    url: String,
    ignored: {
        type: Boolean,
        default: false
    }
});

var model = _mongoose2.default.model("Vhost", schema);

exports.schema = schema;
exports.model = model;
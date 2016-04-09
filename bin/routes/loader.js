"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _controller = require("../controllers/controller");

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    initialize: function initialize(app, router) {
        router.get("/", _controller2.default.index);
        router.get(/^\/unignore\/(\w+)/, _controller2.default.unignore);
        router.get(/^\/ignore\/(\w+)/, _controller2.default.ignore);
        router.get(/\/delete\/(\w+)/, _controller2.default.delete);
        router.get("/sync", _controller2.default.synch);
        router.get("/restart", _controller2.default.restart);
        app.use("/", router);
    }
}; /**
    * Created by david on 03/04/2016.
    */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _client = require("./../mongodb/client");

var _client2 = _interopRequireDefault(_client);

var _vhostRepository = require("./../entity/repository/vhostRepository");

var _vhostRepository2 = _interopRequireDefault(_vhostRepository);

var _sys = require("sys");

var _sys2 = _interopRequireDefault(_sys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by david on 03/04/2016.
 */

var exec = require('child_process').exec;

exports.default = {
    index: function index(req, res) {
        var filters = { ignored: false };
        if (req.query.ignored == "true") {
            req.session.ignored = true;
        } else if (req.query.ignored == "false") {
            req.session.ignored = false;
        }

        if (req.session.ignored) {
            filters = {};
        }

        _vhostRepository2.default.table().find(filters, {
            "sort": [["name", "asc"]]
        }).toArray().then(function (result) {
            if (req.xhr) {
                res.render('index_ajax.html.swig', { vhosts: result });
            } else {
                res.render('index.html.swig', { vhosts: result });
            }
        }, function (err) {
            throw err;
        });
    },
    create: function create(req, res) {
        if (req.method == "post") {}
    },
    restart: function restart(req, res) {
        exec("apachectl restart", {
            uid: 0
        }, function (error, stdout, stderr) {
            console.log("stdout: " + stdout);
            console.log("stderr: " + stderr);
            if (error !== null) {
                console.log("exec error: " + error);
                req.session.flash = {
                    type: "error",
                    message: "Error" + error.message
                };
                return res.redirect("/");
            } else {
                req.session.flash = {
                    type: "success",
                    message: "Serveur Restart"
                };
                return res.redirect("/");
            }
        });
    },
    synch: function synch(req, res) {
        var vhostManager = req.app.get("vhostmanager");
        vhostManager.sync();
    },
    unignore: function unignore(req, res) {
        var objectId = req.params[0];
        var id = _client2.default.objectId(objectId);
        _vhostRepository2.default.table().updateOne({
            _id: id
        }, {
            $set: {
                ignored: false
            }
        }).then(function (data) {
            req.session.flash = {
                type: "success",
                message: "Success"
            };
            return res.redirect("/");
        }, function (err) {
            req.session.flash = {
                type: "error",
                message: "Error" + err.message
            };
        });
    },
    ignore: function ignore(req, res) {
        var objectId = req.params[0];
        var id = _client2.default.objectId(objectId);
        _vhostRepository2.default.table().updateOne({
            _id: id
        }, {
            $set: {
                ignored: true
            }
        }).then(function (data) {
            req.session.flash = {
                type: "success",
                message: "Success"
            };
            return res.redirect("/");
        }, function (err) {
            req.session.flash = {
                type: "error",
                message: "Error" + err.message
            };
        });
    },
    delete: function _delete(req, res) {
        var objectId = req.params[0];
        var id = _client2.default.objectId(objectId);
        var file = undefined;
        _vhostRepository2.default.table().find({ _id: id }).limit(1).next().then(function (vhost) {
            _vhostRepository2.default.table().deleteOne({ _id: id }).then(function (data) {
                exec("rm -fr " + vhost.file, function (error, stdout, stderr) {
                    console.log("stdout: " + stdout);
                    console.log("stderr: " + stderr);
                    if (error !== null) {
                        console.log("exec error: " + error);
                        req.session.flash = {
                            type: "error",
                            message: "Error" + error.message
                        };
                        return res.redirect("/");
                    } else {
                        req.session.flash = {
                            type: "success",
                            message: "Vhost Supprimé"
                        };
                        return res.redirect("/");
                    }
                });
            }, function (err) {
                req.session.flash = {
                    type: "error",
                    message: "Error" + err.message
                };
                console.log(err);
            });
        });
    }
};
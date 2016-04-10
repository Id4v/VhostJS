"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _vhost = require("./../entity/vhost");

var _sys = require("sys");

var _sys2 = _interopRequireDefault(_sys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exec = require('child_process').exec; /**
                                           * Created by david on 03/04/2016.
                                           */

exports.default = {
    index: function index(req, res) {

        var filters = {};
        if (req.method == "POST") {
            if (req.body.name) {
                filters.name = new RegExp(req.body.name);
            }
            if (req.body.url) {
                filters.url = new RegExp(req.body.url);
            }
            if (req.body.documentRoot) {
                filters.documentRoot = new RegExp(req.body.documentRoot);
            }
        }

        filters.ignored = false;

        if (req.query.ignored == "true") {
            req.session.ignored = true;
        } else if (req.query.ignored == "false") {
            req.session.ignored = false;
        }

        if (req.session.ignored) {
            delete filters.ignored;
        }

        _vhost.model.find(filters).sort("name").then(function (result) {
            console.log(req.body);
            if (req.xhr) {
                res.render('index_ajax.html.swig', { vhosts: result, filters: req.body });
            } else {
                res.render('index.html.swig', { vhosts: result, filters: req.body });
            }
        }, function (err) {
            throw err;
        });
    },
    edit: function edit(req, res) {
        var formDatas = req.body;
        var objectId = req.params[0];

        res.locals.title = "Edit";

        if (req.method == "POST") {
            _vhost.model.findOneAndUpdate({
                _id: objectId
            }, formDatas, {
                new: true
            }).then(function (datas) {
                var manager = req.app.get("vhostmanager");
                manager.saveFileForVhost(datas, function (err, written, string) {
                    if (err) {
                        console.log(err);
                        throw err;
                    } else {
                        req.session.flash = {
                            type: "success",
                            message: "Vhost " + datas.name + " modifié"
                        };
                        res.redirect("/restart");
                    }
                });
            }, function (err) {
                console.log(err);
                throw err;
            });
        } else if (req.method == "GET") {
            _vhost.model.findOne({ _id: objectId }).then(function (data) {
                return res.render("edit.html.swig", { vhost: data });
            }, function (err) {
                console.log(err);
                throw err;
            });
        } else {
            res.redirect("/");
        }
    },
    create: function create(req, res) {
        res.locals.title = "Create";

        var formDatas = req.body;
        formDatas.file = "/etc/apache2/vhosts/" + formDatas.name + ".conf";
        if (req.method == "POST") {
            var manager = req.app.get("vhostmanager");
            manager.saveFileForVhost(formDatas, function (err, written, string) {
                if (err) {
                    throw err;
                } else {
                    (function () {
                        var vhost = new _vhost.model(formDatas);
                        vhost.save().then(function (datas) {
                            req.session.flash = {
                                type: "success",
                                message: "Vhost " + vhost.name + " Créé"
                            };
                            res.redirect("/");
                        }, function (err) {
                            throw err;
                        });
                    })();
                }
            });
        } else if (req.method == "GET") {
            res.render("edit.html.swig", { vhost: formDatas });
        } else {
            res.redirect("/");
        }
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
        return res.redirect("/");
    },
    unignore: function unignore(req, res) {
        var objectId = req.params[0];
        _vhost.model.update({
            _id: objectId
        }, {
            ignored: false
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
            return res.redirect("/");
        });
    },
    ignore: function ignore(req, res) {
        var objectId = req.params[0];
        _vhost.model.update({
            _id: objectId
        }, {
            ignored: true
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
            return res.redirect("/");
        });
    },
    delete: function _delete(req, res) {
        var objectId = req.params[0];

        _vhost.model.findOneAndRemove({ _id: objectId }).then(function (data) {
            exec("rm -fr " + data.file, function (error, stdout, stderr) {
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
            return res.redirect("/");
        });
    }
};
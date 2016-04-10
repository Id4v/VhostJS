"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _swig = require("swig");

var _swig2 = _interopRequireDefault(_swig);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _methodOverride = require("method-override");

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _loader = require("./routes/loader");

var _loader2 = _interopRequireDefault(_loader);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by david on 03/04/2016.
 */

function checkDocumentRoot(file) {
    try {
        var stats = _fs2.default.statSync(file);
        return '<i class="teal-text fa fa-check"></i>';
    } catch (e) {
        return '<i class="red-text fa fa-times"></i>';
    }
}

module.exports = function (app) {
    var secretHash = "azdihzadazdoiazdaozih";

    /** Template Engine **/
    _swig2.default.setDefaults({
        locals: {
            test: "Haa"
        }
    });
    checkDocumentRoot.safe = true;
    _swig2.default.setFilter('exists', checkDocumentRoot);
    app.engine('swig', _swig2.default.renderFile);

    /** Set App props **/
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + "/../views");
    app.set('view engine', 'swig');
    app.set('view cache', false);

    /** Configure Swig **/
    _swig2.default.setDefaults({ cache: false });

    /** Middlewares **/
    app.use((0, _morgan2.default)("dev"));
    app.use(_bodyParser2.default.urlencoded({ extended: false }));
    app.use(_bodyParser2.default.json());
    app.use((0, _methodOverride2.default)());
    app.use((0, _cookieParser2.default)(secretHash));
    app.use((0, _expressSession2.default)({
        secret: secretHash,
        saveUninitialized: true,
        resave: true
    }));

    app.use(function (req, res, next) {
        res.locals.flash = req.session.flash;
        req.session.flash = undefined;
        res.locals.ignored = req.session.ignored;
        next();
    });

    app.use('/public/', _express2.default['static'](_path2.default.join(__dirname, '/../public')));

    _loader2.default.initialize(app, new _express2.default.Router());

    return app;
};
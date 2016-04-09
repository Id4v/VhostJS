"use strict";

/**
 * Created by david on 03/04/2016.
 */
(function () {
    var _client = require("mongodb").MongoClient,
        mongodb;

    module.exports = {
        connect: function connect(dburl, callback) {
            _client.connect(dburl, function (err, db) {
                mongodb = db;
                if (callback) {
                    callback();
                }
            });
        },
        client: function client() {
            return _client;
        },
        db: function db() {
            return mongodb;
        },
        objectId: function objectId() {
            var id = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

            return _client.connect.ObjectId(id);
        },
        close: function close() {
            return mongodb.close();
        }
    };
})();
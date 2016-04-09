/**
 * Created by david on 03/04/2016.
 */
(function () {
    var client = require("mongodb").MongoClient,
        mongodb

    module.exports = {
        connect: (dburl, callback) => {
            client.connect(dburl, (err, db) => {
                mongodb = db
                if (callback) {
                    callback()
                }
            })
        },
        client: () => client,
        db: () => mongodb,
        objectId: (id="") =>{
            return client.connect.ObjectId(id)
        },
        close: () => {
            return mongodb.close()
        }
    }
})()
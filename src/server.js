/**
 * Created by david on 03/04/2016.
 */
import express from "express"
import configure from "./configure"
import _ from "underscore"
import mongodb from "./mongodb/client"
import VhostManager from "./entity/manager/vhost"

import mongoose from "mongoose"

var app = express()


app = configure(app)

var server = app.listen(app.get('port'),function(){
    console.log("WebServer launched on localhost at port " + app.get('port'));

    mongoose.connect('mongodb://localhost:27017/vhosts',function(err){
        console.log(err);
        console.log('Connected to Mongo');
        let vhostManager = new VhostManager()
        app.set("vhostmanager",vhostManager)
        vhostManager.sync(null);
    });
})

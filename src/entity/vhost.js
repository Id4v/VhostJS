/**
 * Created by david on 04/04/2016.
 */

import file from "fs"
import _ from "underscore"
import mongoose from "mongoose"

var ObjectId = mongoose.Schema.Types.ObjectId

let schema= new mongoose.Schema({
    file: String,
    name: String,
    documentRoot: String,
    directoryIndex: String,
    url: String,
    ignored: {
        type: Boolean,
        default: false
    }
})

let model = mongoose.model("Vhost",schema)

export {schema,model}
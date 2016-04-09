/**
 * Created by david on 04/04/2016.
 */

import file from "fs"
import _ from "underscore"
import mongo from "./../mongodb/client"

export default class Vhost{

    constructor(file){
        this.file = file
        this.name=undefined
        this.documentRoot=undefined
        this.directoryIndex=undefined
        this.ignored = false
        this.url = ""
    }

    load(callback=null){
        file.readFile(this.file, 'utf-8',(err,data) => {
            if(err){
                throw err
            }

            this.name = _.last(this.file.split("/"))

            let docMatches=data.match(/DocumentRoot (.*)/)
            if(docMatches && docMatches.length>=2) {
                this.documentRoot = docMatches[1]
            }

            let indexMatches=data.match(/DirectoryIndex (.*)/)
            if(indexMatches && indexMatches.length>=2) {
                this.directoryIndex = indexMatches[1]
            }

            let urlMatch=data.match(/ServerName (.*)/)
            if(urlMatch && urlMatch.length >=2){
                this.url=urlMatch[1]
            }else{
                urlMatch=data.match(/Alias (.*)/)
                if(urlMatch && urlMatch.length>=2){
                    let url=urlMatch[1]
                        url = url.split(' ')
                    this.url = 'localhost'+url[0]
                    this.documentRoot= url[1]
                }
            }

            this.save(callback)
        })
    }

    save(callback=null){
        let collec = mongo.db().collection("vhosts")
        collec.find({file:this.file}).toArray((err,docs)=>{
            if(docs.length==0){
                collec.insertOne(this,(err,res) => {
                    if(callback)
                        callback()
                })
            }else{
                let vhostDb=docs[0];
                if(vhostDb.url != this.url || vhostDb.documentRoot!=this.documentRoot || vhostDb.directoryIndex!=this.directoryIndex){
                    this.ignored=vhostDb.ignored;
                    collec.updateOne({_id:mongo.objectId(docs[0]._id)},this,(err,upde)=>{
                        if(err){
                            console.log(err);
                        }
                        if(callback)
                            callback()
                    })
                }else{
                    if(callback)
                        callback()
                }

            }
        })
    }
}

/**
 * Created by david on 04/04/2016.
 */

import glob from "glob"
import {model as Vhost} from "./../vhost"
import _ from "underscore"
import fs from "fs"


function createVhostFromFile(filename){

    fs.readFile(filename, 'utf-8',(err,data) => {
        if (err) {
            console.log(err);
            throw err
        }

        Vhost.findOne({'file':filename}).then((vhost)=>{
            if(!vhost){
                vhost = new Vhost({file:filename})
            }

            vhost.name = _.last(filename.split("/"))

            let docMatches = data.match(/DocumentRoot (.*)/)
            if (docMatches && docMatches.length >= 2) {
                vhost.documentRoot = docMatches[1]
            }

            let indexMatches = data.match(/DirectoryIndex (.*)/)
            if (indexMatches && indexMatches.length >= 2) {
                vhost.directoryIndex = indexMatches[1]
            }

            let urlMatch = data.match(/ServerName (.*)/)
            if (urlMatch && urlMatch.length >= 2) {
                vhost.url = urlMatch[1]
            } else {
                urlMatch = data.match(/Alias (.*)/)
                if (urlMatch && urlMatch.length >= 2) {
                    let url = urlMatch[1]
                    url = url.split(' ')
                    vhost.url = 'localhost' + url[0]
                    vhost.documentRoot = url[1]
                }
            }


            vhost.save((err)=>{
                if(err){
                    console.log(err)
                    throw err
                }
                console.log("  -- Saved "+filename)
            })
        },(err)=>{
            console.log(err)
            throw err
        })
    })
}

function getVhostContent(vhost){

    let url = vhost.url
    url = url.replace("www.","")

    let content =  `
    <VirtualHost *:80>
    ServerName ${url}
    ServerAlias www.${url}

    DirectoryIndex ${vhost.directoryIndex}

    DocumentRoot ${vhost.documentRoot}
    <Directory ${vhost.documentRoot}>
        # enable the .htaccess rewrites
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
    `

    return content
}

export default class VhostManager{
    /**
     *
     * @param callback
     */
    sync(callback){
        console.log("Synching Vhosts in DataBase");
        glob("/etc/apache2/vhosts/*.conf",(err,files) => {
            _.each(files, (object,index,list) => {
                createVhostFromFile(object)
                if(index == list.length-1){
                    console.log("Done ! - "+list.length+" Vhosts")
                }

            })
        })
    }

    /**
     *
     * @param vhost
     * @returns {Promise}
     */
    saveFileForVhost(vhost,callback){
        if(!vhost.file){
            throw new Error("Pas de nom de fichier fourni",1)
        }
        let content = getVhostContent(vhost)
        console.log("Going to write "+vhost.file)
        console.log(content)
        fs.writeFile(vhost.file,content,callback)
    }
}
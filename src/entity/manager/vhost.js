/**
 * Created by david on 04/04/2016.
 */

import glob from "glob"
import Vhost from "./../vhost"
import _ from "underscore"
import mongo from "../../mongodb/client"

export default class VhostManager{
    sync(callback){
        console.log("Synching Vhosts in DataBase");
        glob("/etc/apache2/vhosts/*.conf",(err,files) => {
            _.each(files, (object,index,list) => {
                let vhost = new Vhost(object)
                if(index == list.length-1){
                    console.log("Done !")
                    vhost.load(callback)
                }else{
                    vhost.load()
                }
            })
        })
    }
}
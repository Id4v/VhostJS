/**
 * Created by david on 03/04/2016.
 */

import glob from "glob"
import mongo from "./../mongodb/client"
import vhostRepo from "./../entity/repository/vhostRepository"
import sys from 'sys'

var exec = require('child_process').exec;

export default {
    index: (req, res) => {
        let filters = {ignored: false};
        if (req.query.ignored == "true") {
            req.session.ignored = true;
        } else if (req.query.ignored == "false") {
            req.session.ignored = false;
        }

        if (req.session.ignored) {
            filters = {};
        }

        vhostRepo.table().find(
            filters,
            {
                "sort": [["name", "asc"]]
            }
        ).toArray().then(
            (result)=> {
                if (req.xhr) {
                    res.render('index_ajax.html.swig', {vhosts: result})
                } else {
                    res.render('index.html.swig', {vhosts: result})
                }
            }, (err)=> {
                throw err;
            })
    },
    create: (req,res)=>{
        if(req.method == "post"){

        }
    },
    restart: (req,res) => {
        exec("apachectl restart",
            {
                uid:0
            },
            (error,stdout,stderr)=>{
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
                req.session.flash = {
                    type: "error",
                    message: "Error"+error.message
                }
                return res.redirect("/")
            }else{
                req.session.flash = {
                    type: "success",
                    message: "Serveur Restart"
                }
                return res.redirect("/")
            }
        })
    },
    synch: (req,res) =>{
        let vhostManager = req.app.get("vhostmanager")
        vhostManager.sync()
    },
    unignore: (req, res)=> {
        let objectId = req.params[0]
        let id = mongo.objectId(objectId)
        vhostRepo.table().updateOne(
            {
                _id: id
            },
            {
                $set: {
                    ignored: false
                }
            }).then(
            (data) => {
                req.session.flash = {
                    type: "success",
                    message: "Success"
                }
                return res.redirect("/");
            },
            (err)=> {
                req.session.flash = {
                    type: "error",
                    message: "Error" + err.message
                }
            }
        )
    },
    ignore: (req, res)=> {
        let objectId = req.params[0]
        let id = mongo.objectId(objectId)
        vhostRepo.table().updateOne(
            {
                _id: id
            },
            {
                $set: {
                    ignored: true
                }
            }).then(
            (data) => {
                req.session.flash = {
                    type: "success",
                    message: "Success"
                }
                return res.redirect("/");
            },
            (err)=> {
                req.session.flash = {
                    type: "error",
                    message: "Error" + err.message
                }
            }
        )
    },
    delete: (req, res) => {
        let objectId = req.params[0]
        let id = mongo.objectId(objectId)
        let file = undefined
        vhostRepo.table().find({_id: id}).limit(1).next().then((vhost)=>{
            vhostRepo.table().deleteOne({_id: id})
                .then(
                    (data) => {
                        exec("rm -fr "+vhost.file,(error,stdout,stderr)=>{
                            console.log(`stdout: ${stdout}`);
                            console.log(`stderr: ${stderr}`);
                            if (error !== null) {
                                console.log(`exec error: ${error}`);
                                req.session.flash = {
                                    type: "error",
                                    message: "Error"+error.message
                                }
                                return res.redirect("/")
                            }else{
                                req.session.flash = {
                                    type: "success",
                                    message: "Vhost Supprimé"
                                }
                                return res.redirect("/")
                            }
                        })
                    },
                    (err)=> {
                        req.session.flash = {
                            type: "error",
                            message: "Error" + err.message
                        }
                        console.log(err)
                    }
                )
        })
    }
}
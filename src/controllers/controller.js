/**
 * Created by david on 03/04/2016.
 */

import glob from "glob"
import {model as vhostRepo} from "./../entity/vhost"
import sys from 'sys'

var exec = require('child_process').exec;

export default {
    index: (req, res) => {

        let filters = {}
        if(req.method == "POST"){
            if(req.body.name){
                filters.name = new RegExp(req.body.name)
            }
            if(req.body.url){
                filters.url = new RegExp(req.body.url)
            }
            if(req.body.documentRoot){
                filters.documentRoot = new RegExp(req.body.documentRoot)
            }
        }

        filters.ignored = false


        if (req.query.ignored == "true") {
            req.session.ignored = true;
        } else if (req.query.ignored == "false") {
            req.session.ignored = false;
        }

        if (req.session.ignored) {
            delete filters.ignored
        }

        vhostRepo.find(
            filters
        ).sort("name").then(
            (result)=> {
                console.log(req.body)
                if (req.xhr) {
                    res.render('index_ajax.html.swig', {vhosts: result,filters:req.body})
                } else {
                    res.render('index.html.swig', {vhosts: result,filters:req.body})
                }
            }, (err)=> {
                throw err;
            })
    },
    edit: (req,res)=>{
        let formDatas = req.body
        let objectId=req.params[0]

        res.locals.title="Edit"


        if(req.method == "POST"){
            vhostRepo.findOneAndUpdate(
                {
                    _id: objectId
                },
                formDatas,
                {
                    new:true
                }
            ).then(
                (datas)=>{
                    let manager = req.app.get("vhostmanager")
                    manager.saveFileForVhost(datas,
                        (err,written,string)=>{
                            if(err){
                                console.log(err)
                                throw err
                            }else {
                                req.session.flash = {
                                    type: "success",
                                    message: "Vhost " + datas.name + " modifié"
                                }
                                res.redirect("/restart")
                            }
                        }
                    )
                },
                (err)=>{
                    console.log(err)
                    throw err
                }
            )
        }else if(req.method == "GET"){
            vhostRepo.findOne({_id:objectId}).
            then(
                (data)=>{
                    return res.render("edit.html.swig", {vhost: data})
                },
                (err)=>{
                    console.log(err)
                    throw err
                }
            )
        }else{
            res.redirect("/")
        }
    },
    create: (req,res)=>{
        res.locals.title="Create"

        let formDatas = req.body
        formDatas.file="/etc/apache2/vhosts/"+formDatas.name+".conf"
        if(req.method == "POST"){
            let manager = req.app.get("vhostmanager")
            manager.saveFileForVhost(formDatas,(err,written,string)=>{
                if(err){
                    throw err
                }else {
                    let vhost = new vhostRepo(formDatas)
                    vhost.save().then((datas)=> {
                        req.session.flash = {
                            type: "success",
                            message: "Vhost " + vhost.name + " Créé"
                        }
                        res.redirect("/")
                    }, (err)=> {
                        throw err
                    })
                }
            })
        }else if(req.method == "GET"){
            res.render("edit.html.swig", {vhost: formDatas})
        }else{
            res.redirect("/")
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
        return res.redirect("/")
    },
    unignore: (req, res)=> {
        let objectId = req.params[0]
        vhostRepo.update(
            {
                _id: objectId
            },
            {
                ignored: false
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
                return res.redirect("/");
            }
        )
    },
    ignore: (req, res)=> {
        let objectId = req.params[0]
        vhostRepo.update(
            {
                _id: objectId
            },
            {
                ignored: true
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
                return res.redirect("/");
            }
        )
    },
    delete: (req, res) => {
        let objectId = req.params[0]

        vhostRepo.findOneAndRemove({_id:objectId}).
        then((data)=>{
            exec("rm -fr "+data.file,(error,stdout,stderr)=>{
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
        },(err)=>{
            req.session.flash = {
                type: "error",
                message: "Error" + err.message
            }
            console.log(err)
            return res.redirect("/")
        });
    }
}
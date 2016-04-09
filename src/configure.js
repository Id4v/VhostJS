/**
 * Created by david on 03/04/2016.
 */

import express from "express"
import cookie from "cookie-parser"
import bodyParser from "body-parser"
import swig from "swig"
import morgan from "morgan"
import override from "method-override"
import path from "path"
import routes from "./routes/loader"
import session from "express-session"
import fs from "fs"

function checkDocumentRoot(file){
    try {
        let stats = fs.statSync(file)
        return '<i class="teal-text fa fa-check"></i>'
    }catch(e){
        return '<i class="red-text fa fa-times"></i>'
    }
}

module.exports = function(app){
    let secretHash="azdihzadazdoiazdaozih";

    /** Template Engine **/
    swig.setDefaults({
        locals:{
            test: "Haa"
        }
    })
    checkDocumentRoot.safe=true
    swig.setFilter('exists',checkDocumentRoot)
    app.engine('swig', swig.renderFile)

    /** Set App props **/
    app.set('port',process.env.PORT || 3000)
    app.set('views', __dirname+"/../views")
    app.set('view engine', 'swig')
    app.set('view cache', false)

    /** Configure Swig **/
    swig.setDefaults({ cache: false })

    /** Middlewares **/
    app.use(morgan("dev"))
    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())
    app.use(override())
    app.use(cookie(secretHash))
    app.use(session({
        secret: secretHash,
        saveUninitialized: true,
        resave: true
    }))
    app.use('/public/', express['static'](path.join(__dirname, '/../public')))

    app.use((req,res,next) => {
        res.locals.flash = req.session.flash;
        req.session.flash = undefined
        res.locals.ignored = req.session.ignored;
        next()
    })

    routes.initialize(app, new express.Router())

    return app;
};
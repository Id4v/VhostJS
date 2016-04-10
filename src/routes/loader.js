/**
 * Created by david on 03/04/2016.
 */
import controller from "../controllers/controller"

export default {
    initialize: function(app, router){
        router.get("/", controller.index)
        router.post("/", controller.index)

        router.get(/^\/unignore\/(\w+)/,controller.unignore)
        router.get(/^\/ignore\/(\w+)/,controller.ignore)
        router.get(/^\/delete\/(\w+)/,controller.delete)
        router.get("/sync",controller.synch)
        router.get("/restart",controller.restart)

        router.get("/create/",controller.create)
        router.post("/create/",controller.create)

        router.get(/^\/edit\/(\w+)/,controller.edit)
        router.post(/^\/edit\/(\w+)/,controller.edit)

        app.use("/", router)
    }
}
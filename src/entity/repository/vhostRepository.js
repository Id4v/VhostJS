import mongo from "./../../mongodb/client"

export default {
    table: ()=>{return mongo.db().collection("vhosts")}
}
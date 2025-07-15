// importaciones de mongoose
const {Schema , model} = require("mongoose");

//definicion del schema
const ArticleSchema = Schema({
    title : { type : string , required : true},
    content : { type : string , required : true},
    user : {
         type : Schema.ObjectId ,
         ref : "User",
         required : true
    },
    image : { type : string , default : "default.png"},
    created_at : { type : Date , default : Date.now },
})

//exportar el modelo
module.exports = model( "article" , ArticleSchema , "articles");
//(nombre , modelo , coleccion de mongo)



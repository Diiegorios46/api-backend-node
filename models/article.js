// importaciones de mongoose
const {Schema , model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

//definicion del schema
const ArticleSchema = Schema({
    title : { type : String , required : true},
    content : { type : String , required : true},
    user : {
         type : Schema.ObjectId ,
         ref : "User",
         required : true
    },
    image : { type : String , default : "default.png"},
    created_at : { type : Date , default : Date.now },
})

//exportar el modelo
ArticleSchema.plugin(mongoosePaginate);
module.exports = model( "article" , ArticleSchema , "articles");
//(nombre , modelo , coleccion de mongo)



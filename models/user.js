// importaciones de mongoose
const {Schema , model} = require("mongoose");

//definicion del schema
const UserSchema = Schema({
    name : { type : String , required : true},
    surname: { type : String , required : true},
    email: { type : String , required : true},
    avatar: { type : String , default : "default.png"},
    bio : { type : String},
    password : { type : String , required : true},
    created_at : { type : Date , default : Date.now },
})

//exportar el modelo
module.exports = model( "User" , UserSchema , "users");
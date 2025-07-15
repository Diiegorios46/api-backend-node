//importar la dependencia de mooonge
const mongoose = require("mongoose")

//conectarme 
const connection = async() => {

    try{

        await mongoose.connect("mongodb://127.0.0.1:27017/bd-blog");

        console.log("te has conectado a la bd")

    }catch(error){

        console.log(error)
        throw new Error("No se ha podido conectar la bd")
    }
    
}


module.exports = connection;


//exportar la conexion
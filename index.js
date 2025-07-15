//importar dependencias
const express = require("express");
const cors = require("cors");

//conectarme a la bd
const connection = require("./database/conection")
connection();

//crear servidor de node 
const app = express();
const port = 3907;

//configurar el cors
app.use(cors());

//convertir los datos del body a objetos de js
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//cargar configuracion de rutas
const userRoutes = require("./routes/user")
const articleRoutes = require("./routes/article")

app.use("/api/user",userRoutes)
app.use("/api/article",articleRoutes)

//ruta de prueba
app.get("/pruebitas",(req,res)=>{

    return res.status(200).send({
        "titulo": "man to the moon",
        "description" : "xd"
    })

})

//poner el servidor a escuchar peticiones http
app.listen(port, ()=>{
    console.log("servidor escuchando desde js")
})
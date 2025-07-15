//importaciones 
const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");

// desestructuracion de middlewares
const {auth} = require("../middlewares/auth");

//subida de imagenes 

//definir las rutas
router.post("/register" , UserController.register);
router.post("/login" , UserController.login);
router.get("/profile/:id" , UserController.profile)
router.put("/update" ,auth, UserController.update);
router.put("/upload/:id" , [auth] ,  UserController.upload);
router.get("/avatar/:file", UserController.avatar);
router.get("/solo-para-identificados", auth , UserController.soloParaUsuariosIdentificados);


//exportar las rutas
module.exports = router;

//importaciones 
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

// desestructuracion de middlewares
const {auth} = require("../middlewares/auth");

//subida de imagenes 
const multer = require("multer");

const storage = multer.diskStorage({
    destination : (req,file, cb) => {
        cb(null , "./uploads/avatars");
    },
    filename : (req , file , cb) => {
        cb(null , "avatar-" + Date.now() + "-" + file.originalname);
    }
})

const uploadsAvatar = multer({storage})

//definir las rutas
router.post("/register" , UserController.register);
router.post("/login" , UserController.login);
router.get("/profile/:id" , UserController.profile)
router.put("/update" ,auth, UserController.update);
router.put("/upload/" , [auth, uploadsAvatar.single("file0")] ,  UserController.upload);
router.get("/avatar/:file", UserController.avatar);
router.get("/solo-para-identificados", auth , UserController.soloParaUsuariosIdentificados);


//exportar las rutas
module.exports = router;

//importaciones
const express = require("express")
const router = express.Router();
const {auth} = require("../middlewares/auth");
const ArticleController = require("../controllers/article")

//cargar middleware de autenticacion

//configuracion de subida de archivos
const multer = require("multer");

const storage = multer.diskStorage({
    destination : (req,file, cb) => {
        cb(null , "./uploads/posters");
    },
    filename : (req , file , cb) => {
        cb(null , "poster-" + Date.now() + "-" + file.originalname);
    }
})

const uploadsPoster = multer({storage})

//definir las rutas
router.post("/save" ,auth, ArticleController.save)
router.get("/list/:page" , ArticleController.list)
router.get("/detail/:id" , ArticleController.detail)
router.put("/update" ,auth, ArticleController.update)
router.delete("/remove/:id" ,auth, ArticleController.remove)
router.get("/by-user/:userId/:page" , ArticleController.byUser)
router.get("/search/:search" , ArticleController.search)
router.get("/upload/:articleId" ,[auth,uploadsPoster.single("file0")], ArticleController.upload)
router.get("/poster/:file" , ArticleController.poster)


//exporto las rutas
module.exports = router;
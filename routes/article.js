//importaciones
const express = require("express")
const router = express.Router();

const ArticleController = require("../controllers/article")

//cargar middleware de autenticacion

//configuracion de subida de archivos


//definir las rutas
router.post("/save" , ArticleController.save)
router.get("/list/:page" , ArticleController.list)
router.get("/detail/:id" , ArticleController.detail)
router.post("/generate-ia" , ArticleController.save)
router.put("/update" , ArticleController.update)
router.delete("/remove" , ArticleController.remove)
router.get("/by-user/:userId" , ArticleController.byUser)
router.get("/search/:search" , ArticleController.search)
router.get("/upload/:id" , ArticleController.upload)
router.put("/poster/:file" , ArticleController.poster)


//exporto las rutas
module.exports = router;
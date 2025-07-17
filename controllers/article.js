//importaciones
const validate = require("../helpers/validate-article");
const Article = require("../models/article");
const path = require("path")
//filesistem = fs
const fs = require("fs")

// acciones

const save = (req, res) => {

    const body = req.body;

    try {
        // Validar los datos
        validate(body);
    } catch (error) {
        return res.status(400).json({
            status: "ERROR",
            message: error.message
        })
    }

    body.user = req.user.id

    let articleToSave = new Article(body);

    articleToSave.save().then((articleStored) => {

        if (!articleStored) {
            return res.status(400).json({
                status: "ERROR",
                message: "Error al guardar el articulo"
            });
        }

        return res.status(200).json({
            status: "SUCCESS",
            article: articleStored
        });

    }).catch((error) => {

        return res.status(500).json({
            status: "ERROR",
            message: "Error en el servidor al guardar el articulo",
            error
        });

    })

}

const list = (req, res) => {

    let params = req.params;

    let page = 1;

    if (params.page) {
        page = params.page;
    }

    let itemsPerPage = 10;

    const options = {
        page,
        limit: itemsPerPage,
        sort: { created_at: -1 },
        populate: {
            path: "user",
            select: "-password -__v -created_at "
        }
    }

    Article.paginate({}, options)
        .then((result) => {

            if (!result.docs) {
                return res.status(404).json({
                    status: "ERROR",
                    message: "No se han encontrado articulos"
                });
            }

            return res.status(200).json({
                status: "SUCCESS",
                page,
                itemsPerPage,
                totalItems: result.totalDocs,
                articles: result.docs,
                pages: Math.ceil(result.totalDocs / itemsPerPage)
            });

        }).catch((error) => {
            return res.status(500).json({
                status: "ERROR",
                message: "Error en el servidor al listar los articulos",
                error
            });
        })

}

const detail = (req, res) => {

    const id = req.params.id;

    Article.findById(id)
        .populate({
            path: "user",
            select: "-password -__v -created_at "
        }).then(article => {

            if (!article) {
                return res.status(404).json({
                    status: "ERROR",
                    message: "No se ha encontrado el articulo"
                });
            }

            return res.status(200).json({
                status: "SUCCESS",
                article
            });

        })

}

const update = (req, res) => {
    const body = req.body;

    try {
        validate(body);
    } catch (error) {
        return res.status(400).json({
            status: "ERROR",
            message: error.message
        });
    }

    let userIdentity = req.user.id;

    Article.findById(body.id)
        .then(article => {
            if (!article) {
                return res.status(404).json({
                    status: "ERROR",
                    message: "No se ha encontrado el artículo"
                });
            }

            // Verificar que el usuario es el dueño
            if (article.user.toString() !== userIdentity.toString()) {
                return res.status(403).json({
                    status: "ERROR",
                    message: "No tienes permisos para actualizar este artículo"
                });
            }

            // Actualizar el artículo
            Article.findByIdAndUpdate(body.id, body, { new: true })
                .then(articleUpdated => {
                    if (!articleUpdated) {
                        return res.status(404).json({
                            status: "ERROR",
                            message: "No se pudo actualizar el artículo"
                        });
                    }

                    return res.status(200).json({
                        status: "SUCCESS",
                        message: "Se actualizó correctamente",
                        article: articleUpdated
                    });
                })
                .catch(error => {
                    return res.status(500).json({
                        status: "ERROR",
                        message: "Error en el servidor al actualizar el artículo",
                        error
                    });
                });
        })
        .catch(error => {
            return res.status(500).json({
                status: "ERROR",
                message: "Error en el servidor al buscar el artículo",
                error
            });
        });
}


const remove = (req, res) => {
    const idParam = req.params.id;
    let userIdentity = req.user.id;

    Article.findById(idParam).then(article => {
        if (!article) {
            return res.status(404).json({
                status: "ERROR",
                message: "No se ha encontrado el artículo"
            });
        }

        if (article.user.toString() !== userIdentity.toString()) {
            return res.status(403).json({
                status: "ERROR",
                message: "No tienes permisos para eliminar este artículo"
            });
        }

        Article.findByIdAndDelete(idParam)
            .then(articleDelete => {
                if (!articleDelete) {
                    return res.status(404).json({
                        status: "ERROR",
                        message: "No se pudo eliminar el artículo"
                    });
                }

                return res.status(200).json({
                    status: "SUCCESS",
                    message: "Se eliminó correctamente",
                    articleDeleted: articleDelete
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    status: "ERROR",
                    message: "Error en el servidor al eliminar el artículo",
                    error
                });
            });

    }).catch((error) => {
        return res.status(500).json({
            status: "ERROR",
            message: "Error en el servidor al buscar el artículo",
            error
        });
    });
}


const byUser = (req, res) => {
    
    let params = req.params;

    let page = 1;

    if (params.page) {
        page = params.page;
    }

    let itemsPerPage = 10;

    const options = {
        page,
        limit: itemsPerPage,
        sort: { created_at: -1 },
        populate: {
            path: "user",
            select: "-password -__v -created_at "
        }
    }

    Article.paginate({ user : req.params.userId }, options)
        .then((result) => {

            if (!result.docs) {
                return res.status(404).json({
                    status: "ERROR",
                    message: "No se han encontrado articulos"
                });
            }

            return res.status(200).json({
                status: "SUCCESS",
                page,
                itemsPerPage,
                totalItems: result.totalDocs,
                articles: result.docs,
                pages: Math.ceil(result.totalDocs / itemsPerPage)
            });

        }).catch((error) => {
            return res.status(500).json({
                status: "ERROR",
                message: "Error en el servidor al listar los articulos",
                error
            });
        })

}

const search = (req, res) => {

    let searchString = req.params.search;

    Article.find({
        "$or" : [
            { "title" : {"$regex" : searchString , "$options" : "i"} } ,
            { "content" : {"$regex" : searchString , "$options" : "i"} }
        ]
    }).sort({ created_at : -1 })
    .then( articles => {

        if(!articles){
            return res.status(404).json({
                status: "ERROR",
                message: "Error no hay articulos que coincidan con tu busqueda",
            });
        }

        return res.status(200).send({
            status: "SUCCESS ",
            articles 
        })
    })
}


const upload = async(req,res) => {
    
    try{
        
        const userId = req.user.id;
        const articleId = req.params.articleId

        const {originalname, filename , path : filePath} = req.file;

        const ext = path.extname(originalname).toLowerCase();
        const validExtensions = [".png", ".jpg", ".jpeg", ".gif"];

        if(!validExtensions.includes(ext)){
            // eliminar el archivo subido
            fs.unlinkSync(filePath);
            return res.status(400).json({
                status : "ERROR",   
                message : "La extension de la imagen no es valida"
            });
        }

        const article = await Article.findById(articleId);

        if(!article){
            fs.unlinkSync(filePath);
            return res.status(400).json({
                status : "ERROR",   
                message : "No existe el articulo"
            });
        }

        if(article.user.toString() !== userId.toString()){
            fs.unlinkSync(filePath);
            return res.status(400).json({
                status : "ERROR",   
                message : "No tienes permisos para subir imagenes a este articulo"
            });
        }


        const articleUpdate = await Article.findByIdAndUpdate(articleId , {image : filename} , {new : true});

        if(!articleUpdate){
            return res.status(400).json({
                status : "ERROR",
                message : "Error al buscar el articulo"
            });
        }

        return res.status(200).json({
            status : 200,
            message : "Imagen subida correctamente",
            article : articleUpdate
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            status : "ERROR",
            message : "Error al subir la imagen"
        })
    }

}

const poster = (req, res) => {

    let file = req.params.file;
    let filePath = "./uploads/posters/" + file;

    fs.stat(filePath, (error, exist) => {

        if(!error && exist){
            return res.sendFile(path.resolve(filePath));
            
        }else{
            return res.status(404).json({
                status : "ERROR",
                message : "El avatar no existe"
            }); 
        }

    })

}

const generate = (req, res) => {

    return res.status(200).send({
        status: 200,
        message: "Accion para generar con ia un article"
    })

}


// exportaciones
module.exports = {
    save,
    list,
    detail,
    generate,
    update,
    remove,
    byUser,
    search,
    upload,
    poster
}

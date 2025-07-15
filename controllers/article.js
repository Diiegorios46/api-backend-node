
//importaciones


// acciones

const save = (req,res) => {

    return res.status(200).json({
        status : 200 ,
        message : "Accion para guardar articulos"
    })

}

const list = (req,res) => {
    
    return res.status(200).json({
        status : 200 ,
        message : "Accion para list articulos"
    })


}

const detail = (req,res) => {

    return res.status(200).send({
        status : 200 ,
        message : "Accion para mostrar un solo article"
    })

}

const generate = (req,res) => {

    return res.status(200).send({
        status : 200 ,
        message : "Accion para generar con ia un article"
    })

}

const update = (req,res) => {

    return res.status(200).send({
        status : 200 ,
        message : "Accion para generar con ia un article"
    })

}


const remove = (req,res) => {

    return res.status(200).send({
        status : 200 ,
        message : "Accion para eliminar un article"
    })

}


const byUser = (req,res) => {

    return res.status(200).send({
        status : 200 ,
        message : "Accion para sacar articulos creados por usuario"
    })

}

const search = (req,res) => {

    return res.status(200).send({
        status : 200 ,
        message : "Accion para buscar un article"
    })

}


const upload = (req,res) => {

    return res.status(200).send({
        status : 200 ,
        message : "Accion para subir img a un article"
    })

}

const poster = (req,res) => {

    return res.status(200).send({
        status : 200 ,
        message : "Accion para postear"
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

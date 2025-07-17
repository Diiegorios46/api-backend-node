//Importaciones 
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const validate = require("../helpers/validate-user");
const jwt = require("../helpers/jwt");
const User = require("../models/user");


//acciones

const register = (req,res) => {
    
    // Recoger los datos de la peticion
    const body = req.body;

    // validar los datos  
    try{
        validate(body);
    }catch(error){
        return res.status(400).json({
            status : "ERROR",
            message : error.message
        })
    }

    // control de duplicados
    User.find({
        $or:[
            {email : body.email.toLowerCase()},
            {nick : body.nick.toLowerCase()},
        ]
    }).then( async(users) => {

        if(users && users.length >= 1){
            
            return res.status(400).json({
                status : "ERROR",
                message : "El usuario ya existe"
            })

        }

        // cifrar contraseña
        let password = await bcrypt.hash(body.password, 10);
        body.password = password;

        // crear el objeto de usuario
        body.email = body.email.toLowerCase();
        body.nick = body.nick.toLowerCase();
        let userToSave = new User(body);

        // guardar el usuario en la base de datos
        userToSave.save().then( (error) => {
            
            console.log(error);

            if(!userToSave){
                return res.status(400).json({
                    status : "ERROR",
                    message : "Error al crear el usuario"
                });
            }  

            // quitar contraseña
            const userClened = userToSave.toObject();
            delete userClened.password;

            return res.status(200).json({
                status : 200,
                message : "Usuario creado correctamente",
                data : userClened
            })
             
        })

    }).catch(error => {
        console.log(error);
        return res.status(500).json({
            status : "ERROR",
            message : "Error al comprobar duplicados",
            error: "Error en la consulta del usuario duplicado"
        });
    })

}
const login = (req,res) => {
    
    // Recoger los datos de la peticion
    const body = req.body;

    // comprobar que me llegan los datos
    if(!body.email || !body.password){
        return res.status(400).json({
            status : "error",
            message : "Faltan datos por enviar" 
        })
    }


    // comprobar que el usuario existe
    User.findOne({
        
        email : body.email.toLowerCase()
        
    }).then( user => {

        // comparar la contraseña
        let pwd = bcrypt.compareSync(body.password , user.password);

        if(!pwd){
            return res.status(400).json({
                status : "error",
                message : "La contraseña no es correcta !!"
            })
        }

        // creo el token de autenticacion
        let token = jwt.createToken(user);

        // devuelvo la respuesta
        return res.status(200).json({
            status : "success" ,
            user : {
                _id : user._id ,
                name : user.name,
                nick : user.nick
            },
            token 
        })

    }).catch( error => {
        console.log(error)
       
        return res.status(500).json({
            status : "error",
            message : "Error al buscar al usuario" 
        })

    })
   
}

const profile = (req,res) => {

    // Recoger el id del usuario que pasan por parametro url
    let id = req.params.id;


    User.findById(id)
        .select({
            "password" : 0,
            "email" : 0,
            "created_at" : 0
        }).then(myUser => {

            if(!myUser){
                return res.status(404).json({
                    status : "error",
                    message : "No existe el usuario"
                })
            }

            return res.status(200).json({
                status : 200,
                message : "accion para profile",
                user : myUser
            })

        }).catch(error => {
            console.log(error); 
            return res.status(404).json({
                status : "error",
                message : "Error al buscar el usuario"
            })
        })

}

const update = async(req,res) => {

    try{
    
        // conseguir la identidad del usuario identificado
        const userIdentity = req.user;    

        // crear obj con datos nuevos
        let userToUpdate = {
            name : req.body.name ?? userIdentity.name,
            surname : req.body.surname ?? userIdentity.surname,
            nick : req.body.nick ?? userIdentity.nick, 
            email : req.body.email ?? userIdentity.email, 
            bio : req.body.bio ?? userIdentity.bio
        }
        // validar los datos
        validate(userToUpdate,false);
        // buscar si el usuario existe
        const users = await User.find({
            $or:[
                {email : userToUpdate.email.toLowerCase()},
                {nick : userToUpdate.nick.toLowerCase()}
            ]
        });

        // recorrer y comprobar los usuarios encontrados
        const userExist = users.some(user => user.id.toString() !== userIdentity._id.toString());

        if(userExist){
            return res.status(400).json({
                status : "ERROR",
                message : "El email o el nick ya estan en uso"
            })
        }

        // actualizar el usuario en la base de datos
        const userUpdated = await User.findByIdAndUpdate(userIdentity.id,userToUpdate, {new : true , select : "-password"});

        if(!userUpdated){
            return res.status(400).json({
                status : "ERROR",
                message : "Error al actualizar el usuario"
            });
        }

        return res.status(200).json({
            status : "success",
            user : userUpdated , 
            userIdentity : userIdentity
        })  

    }catch(error){
        console.log(error);
        return res.status(500).json({
            status : "ERROR",
            message : "Error al actualizar el usuario",
        })
    }

}


const upload = async(req,res) => {
    
    try{
        
        const id = req.user.id;

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

        const userUpdated = await User.findByIdAndUpdate(id , {avatar : filename} , {new : true});

        if(!userUpdated){
            return res.status(400).json({
                status : "ERROR",
                message : "Error al actualizar el usuario"
            });
        }

        return res.status(200).json({
            status : 200,
            message : "Imagen subida correctamente",
            file : {
                originalname,
                filename,
                path : filePath,
                ext
            }
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            status : "ERROR",
            message : "Error al subir la imagen"
        })
    }

}

const avatar = (req,res) => {

    let file = req.params.file;
    let filePath = "./uploads/avatars/" + file;

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

const soloParaUsuariosIdentificados = (req,res) => {

    return res.status(200).json({
        status : 200,
        message : "accion para usuarios identificados",
        user : req.user , 
        datosDeluSsuario : req.userk
    })
    
}



//exportaciones
module.exports = {
    register,
    login,
    profile,
    update,
    upload,
    avatar,
    soloParaUsuariosIdentificados
}
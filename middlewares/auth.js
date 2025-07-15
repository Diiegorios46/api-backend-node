// importar modulos
const jwt = require("jwt-simple"); // importar helper de jwt

// importar clave secreta
const {secret} = require("../helpers/jwt");

// middleware de autenticacion
exports.auth = (req, res, next) => {

    // comprobar si existe el header de autorizacion
    if(!req.headers.authorization){
        return res.status(403).json({
            status: "error",
            message: "La peticion no tiene la cabecera de autorizacion"
        });
    }

    // limpíar el token
    let token = req.headers.authorization.replace(/['"]+/g, '');

    // decodificar el token
    try{

        let payload = jwt.decode(token, secret);

        // comprobar la expiración del token
        let now = Math.floor(Date.now() / 1000); // tiempo actual en segundos

        if(payload.exp <= now){
            return res.status(401).json({
                status: "error",
                message: "El token ha expirado"
            });
        }

        // añadir los datos del usuario a la request
        req.user = payload

    }catch(error){
        return res.status(404).json({
            status: "error",
            message: "Token no valido"
        });
    }



    // pasar a la accion 

    console.log("Middleware de autenticacion ejecutado");
    next();
}



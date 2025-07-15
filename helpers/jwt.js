let jwt = require('jwt-simple');

//clave secreta
const secret = "Clave-de-mi-backend-DE-NODE-puntoJS";

// crear funcion para generar token
const createToken = (user) => {

    let now = Math.floor(Date.now() / 1000); // tiempo actual en segundos
    let expiration = now + 30 * 24 * 60 * 60; // 24 horas de validez


    let payload = {
        id : user._id,
        name : user.name,
        surname : user.surname,
        email : user.email,
        bio : user.bio,
        avatar : user.avatar,
        iat: now,
        exp : expiration
    }

    // crear el token
    return jwt.encode(payload, secret);
}

// exportar funcion etc

module.exports = {
    createToken ,
    secret
};

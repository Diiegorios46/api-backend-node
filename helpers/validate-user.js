const validator = require("validator");

const validate = (param , withPassword = true) => {
    if (!param || typeof param !== "object") {
        throw new Error("No se han recibido datos para validar");
    }

    // Validar nombre
    if (!param.name || validator.isEmpty(param.name)) {
        throw new Error("El nombre es obligatorio");
    }
    if (!validator.isLength(param.name, { min: 3, max: 50 })) {
        throw new Error("El nombre debe tener entre 3 y 50 caracteres");
    }
    if (!validator.isAlpha(param.name, 'es-ES', { ignore: ' ' })) {
        throw new Error("El nombre solo puede contener letras");
    }

    // Validar apellido
    if (!param.surname || validator.isEmpty(param.surname)) {
        throw new Error("El apellido es obligatorio");
    }
    if (!validator.isLength(param.surname, { min: 3, max: 80 })) {
        throw new Error("El apellido debe tener entre 3 y 80 caracteres");
    }
    if (!validator.isAlpha(param.surname, 'es-ES', { ignore: ' ' })) {
        throw new Error("El apellido solo puede contener letras");
    }

    // Validar nick
    if (!param.nick || validator.isEmpty(param.nick)) {
        throw new Error("El nick es obligatorio");
    }
    if (!validator.isLength(param.nick, { min: 3, max: 60 })) {
        throw new Error("El nick debe tener entre 3 y 60 caracteres");
    }

    // Validar email
    if (!param.email || validator.isEmpty(param.email)) {
        throw new Error("El email es obligatorio");
    }
    if (!validator.isEmail(param.email)) {
        throw new Error("El email no es válido");
    }

    // Validar contraseña
    if(withPassword) {
        if (!param.password || validator.isEmpty(param.password)) {
            throw new Error("La contraseña es obligatoria");
        }
        if (!validator.isLength(param.password, { min: 3, max: 100 })) {
            throw new Error("La contraseña debe tener entre 3 y 100 caracteres");
        }
    }


    return true;
}

module.exports = validate;
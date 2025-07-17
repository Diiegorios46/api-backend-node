const validator = require("validator");

const validate = (param ) => {
    if (!param || typeof param !== "object") {
        throw new Error("No se han recibido datos para validar");
    }

    // Validar title
    if (!param.title || validator.isEmpty(param.title)) {
        throw new Error("El title es obligatorio");
    }
    if (!validator.isLength(param.title, { min: 5, max: 150 })) {
        throw new Error("El title debe tener entre 3 y 50 caracteres");
    }

    // Validar content
    if (!param.content || validator.isEmpty(param.content)) {
        throw new Error("El content es obligatorio");
    }
    if (!validator.isLength(param.content, { min: 5, max: 1800 })) {
        throw new Error("El content debe tener entre 5 y 180 caracteres");
    }


    return true;
}

module.exports = validate;
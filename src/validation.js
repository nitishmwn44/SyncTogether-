
const Joi = require('@hapi/joi');

//registerion validation

const registerValidation = (data)=>{
    const schema = Joi.object({
        name: Joi.string().required(true),
        email: Joi.string().min(6).required(true),
        password: Joi.string().min(6).required(true),
    });

    return schema.validate(data);
}

const loginValidation = (data)=>{
    const schema = Joi.object({
        email: Joi.string().min(6).required(true),
        password: Joi.string().min(6).required(true),
    });

    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
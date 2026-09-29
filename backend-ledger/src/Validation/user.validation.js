const Joi = require("joi");

const registerSchema = Joi.object({

    name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.base": "Name must be a string",
            "string.empty": "Name is required",
            "string.min": "Name must contain at least 3 characters",
            "string.max": "Name cannot exceed 30 characters",
            "any.required": "Name is required",
        }),

    email: Joi.string()
        .email()
        .trim()
        .lowercase()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please enter a valid email",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .pattern(
            new RegExp(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$"
            )
        )
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.pattern.base":
                "Password must contain at least 6 characters, one uppercase, one lowercase, one number and one special character.",
            "any.required": "Password is required",
        })
});


const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please enter a valid email",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
            "any.required": "Password is required",
        }),
})
.options({
    allowUnknown: false,
});

module.exports = {
    registerSchema,
    loginSchema,
};
const Joi = require("joi");

const getAccountBalanceSchema = Joi.object({
    accountId: Joi.string()
        .length(24)
        .hex()
        .required()
        .messages({
            "string.empty": "Account id is required",
            "string.length": "Invalid account id",
            "string.hex": "Invalid account id",
            "any.required": "Account id is required",
        }),
}).options({
    allowUnknown: false,
});

const getAccountByNumberSchema = Joi.object({
    accountNumber: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Account number is required",
            "any.required": "Account number is required",
        }),
}).options({
    allowUnknown: false,
});

module.exports = {
    getAccountBalanceSchema,
    getAccountByNumberSchema,
};
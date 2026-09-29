const Joi = require("joi");

const createTransactionSchema = Joi.object({
    fromAccount: Joi.string()
        .length(24)
        .hex()
        .required()
        .messages({
            "string.empty": "From account is required",
            "string.length": "Invalid from account id",
            "string.hex": "Invalid from account id",
            "any.required": "From account is required",
        }),

    toAccount: Joi.string()
        .length(24)
        .hex()
        .required()
        .messages({
            "string.empty": "To account is required",
            "string.length": "Invalid to account id",
            "string.hex": "Invalid to account id",
            "any.required": "To account is required",
        }),

    amount: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Amount must be a number",
            "number.positive": "Amount must be greater than 0",
            "any.required": "Amount is required",
        }),

    idempotencyKey: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Idempotency key is required",
            "any.required": "Idempotency key is required",
        }),
}).options({
    allowUnknown: false,
});

const createInitialFundsTransactionSchema = Joi.object({
    toAccount: Joi.string()
        .length(24)
        .hex()
        .required()
        .messages({
            "string.empty": "To account is required",
            "string.length": "Invalid to account id",
            "string.hex": "Invalid to account id",
            "any.required": "To account is required",
        }),

    amount: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Amount must be a number",
            "number.positive": "Amount must be greater than 0",
            "any.required": "Amount is required",
        }),

    idempotencyKey: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Idempotency key is required",
            "any.required": "Idempotency key is required",
        }),
}).options({
    allowUnknown: false,
});

/**
 * - Allowed sortable fields derived from the actual Transaction schema:
 *   createdAt, updatedAt (auto timestamps) and amount (decimal field).
 *   Optional leading "-" means descending; anything else is rejected by Joi.
 */
const SORTABLE_FIELDS = ["createdAt", "updatedAt", "amount"];

const getTransactionsQuerySchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Page must be a number",
            "number.integer": "Page must be an integer",
            "number.min": "Page must be greater than or equal to 1",
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            "number.base": "Limit must be a number",
            "number.integer": "Limit must be an integer",
            "number.min": "Limit must be greater than or equal to 1",
            "number.max": "Limit must be less than or equal to 100",
        }),

    search: Joi.string()
        .trim()
        .max(200)
        .messages({
            "string.base": "Search must be a string",
            "string.max": "Search query must be at most 200 characters",
        }),

    status: Joi.string()
        .valid("PENDING", "COMPLETED", "FAILED", "REVERSED")
        .messages({
            "string.base": "Status must be a string",
            "any.only":
                "Status must be one of PENDING, COMPLETED, FAILED, or REVERSED",
        }),

    sort: Joi.string()
        .pattern(new RegExp(`^(-)?(${SORTABLE_FIELDS.join("|")})$`))
        .default("-createdAt")
        .messages({
            "string.base": "Sort must be a string",
            "string.pattern":
                "Sort must be one of: createdAt, -createdAt, updatedAt, -updatedAt, amount, -amount",
        }),
}).options({
    allowUnknown: false,
});

module.exports = {
    createTransactionSchema,
    createInitialFundsTransactionSchema,
    getTransactionsQuerySchema,
};

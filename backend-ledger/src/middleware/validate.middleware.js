const ApiError = require("../utils/ApiError");

const validate = (schema, source = "body") => {

    return (req, res, next) => {

        const { value, error } = schema.validate(req[source], {
            abortEarly: false,
            stripUnknown: true,
            convert: true,
        });

        if (error) {
            throw new ApiError(
                400,
                error.details.map(err => err.message).join(", ")
            );
        }

        req[source] = value;

        next();

    };

};

module.exports = validate;
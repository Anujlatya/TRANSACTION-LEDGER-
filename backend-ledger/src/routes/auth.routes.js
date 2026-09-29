const express = require('express');
const authController = require("../controller/auth.controller");
const adminController = require("../controller/admin.controller");


/**
 * - require Middleware
 */
const validate = require("../middleware/validate.middleware");
const { authMiddleware } = require('../middleware/auth.middleware');
const { registerSchema, loginSchema } = require("../Validation/user.validation");
const {
    loginLimiter,
    registerLimiter,
} = require("../middleware/rateLimit.middleware");
const authorizeRoles = require('../middleware/authorizeMIddleware');


const router = express.Router();

router.post("/register", registerLimiter, validate(registerSchema), authController.userRegisterController);

router.post("/login", loginLimiter, validate(loginSchema),authController.userLoginController);

router.post("/logout", authController.userLogoutController);

router.get("/me", authMiddleware, authController.getMeController);







module.exports = router;
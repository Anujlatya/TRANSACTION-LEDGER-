const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


/**
 * - Controller Required
 */
const accountController = require("../controller/account.controller");

const {
    getAccountBalanceSchema,
    getAccountByNumberSchema,
} = require("../validation/account.validation");
const validate = require("../middleware/validate.middleware");


/**
 * - POST /api/account/
 * - Create a new account
 */
router.post("/", authMiddleware.authMiddleware, accountController.createAccountController);

/**
 * - GET /api/account/
 * - get accounts of a user
 */
router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountsController);

/**
 * - GET /api/account/balance/:accountId
 * - get account balance
 */
router.get("/balance/:accountId", validate(getAccountBalanceSchema),authMiddleware.authMiddleware, accountController.getAccountBalanceController);

/**
 * - GET /api/account/search/:accountNumber
 * - search account by accountNumber
 */
router.get("/search/:accountNumber",validate(getAccountByNumberSchema), authMiddleware.authMiddleware, accountController.getAccountByNumberController);


module.exports = router;

const express = require("express");
const transactionController = require("../controller/transaction.controller");

const transactionRouter = express.Router();


/**
 * - Require Middleware
 */
const authMiddleware = require('../middleware/auth.middleware');
const validate = require("../middleware/validate.middleware");
const {createTransactionSchema, createInitialFundsTransactionSchema, getTransactionsQuerySchema} =  require("../Validation/transaction.validation")
const {
    transactionLimiter,
} = require("../middleware/rateLimit.middleware");


/**
 * - POST /api/transaction/
 * - create a new transaction
*/

transactionRouter.post("/", transactionLimiter, validate(createTransactionSchema), authMiddleware.authMiddleware, transactionController.createTransaction);

/**
 * - POST /api/transaction/system/initial-funds
 * - create initial funds trnsaction for system user 
 */

transactionRouter.post("/system/initial-funds", validate(createInitialFundsTransactionSchema), authMiddleware.systemUserAuthMiddleware, transactionController.createInitialFundsTransaction);

/**
 * - GET /api/transaction/
 */
transactionRouter.get("/", validate(getTransactionsQuerySchema, "query"), authMiddleware.authMiddleware, transactionController.getAllTransactionOfUserController);

/**
 * - GET /api/transaction/ledger
 * - give all ledger of user accounts 
 */
transactionRouter.get("/ledger", authMiddleware.authMiddleware, transactionController.getAllLedgerOfUserController )



module.exports = transactionRouter;
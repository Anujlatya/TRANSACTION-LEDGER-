const express = require("express");
const authController = require("../controller/auth.controller");
const adminController = require("../controller/admin.controller");
const authorizeRoles = require('../middleware/authorizeMIddleware');
const { authMiddleware } = require('../middleware/auth.middleware');


const router = express.Router();


/**
 * - ADMIN ROUTES
*/
router.get("/admin", authMiddleware, authorizeRoles("ADMIN"), authController.getMeController);

router.get("/admin/users", authMiddleware, authorizeRoles("ADMIN"), adminController.getAllUser);

router.get("/admin/accounts/:userId", authMiddleware, authorizeRoles("ADMIN"), adminController.getAccountsOfUser);

router.get("/admin/transaction/:userId", authMiddleware, authorizeRoles("ADMIN"), adminController.getAllTransaction);

router.patch("/admin/account/status/:accountId", authMiddleware, authorizeRoles("ADMIN"), adminController.updateStatus);

router.delete("/admin/account/:accountId", authMiddleware, authorizeRoles("ADMIN"), adminController.deleteAccount);

router.patch("/admin/user/role/:userId", authMiddleware, authorizeRoles("ADMIN"), adminController.updateUserRole);

router.delete("/admin/user/:userId", authMiddleware, authorizeRoles("ADMIN"), adminController.deleteUser);

router.get("/admin/dashboard", authMiddleware, authorizeRoles("ADMIN"), adminController.getDashboardDetails);

module.exports = router;
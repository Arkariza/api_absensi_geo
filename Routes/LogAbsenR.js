const express = require("express")
const router = express.Router()

const adminController = require("../Controllers/AdminController")
const auth = require("../Middleware/AuthMiddleware")
const role = require("../Middleware/RoleMiddleware")

router.get("/log", auth, role.adminCheck, adminController.getLogs)
router.get("/log/:id", auth, role.adminCheck, adminController.getLogsByUser)
router.get("/log-hari-ini", auth, role.adminCheck, adminController.getTodayLogs)

module.exports = router
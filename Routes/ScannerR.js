const express = require("express")
const router = express.Router()

const LogAbsenController = require("../Controllers/LogAbsenController")
const auth = require("../Middleware/AuthMiddleware")
const role = require("../Middleware/RoleMiddleware")

router.post("/scan", auth, role.adminOrKetuaKelas, LogAbsenController.scanQR)

module.exports = router
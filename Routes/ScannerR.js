const express = require("express")
const router = express.Router()

const LogAbsenController = require("../Controllers/LogAbsenController")
const auth = require("../Middleware/AuthMiddleware")
const role = require("../Middleware/RoleMiddleware")

router.get("/scan", auth, role.adminOrKetuaKelas, LogAbsenController.buatKodeQR)

module.exports = router
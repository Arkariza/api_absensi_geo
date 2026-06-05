const express = require("express")
const router = express.Router()

const ScannerController = require("../Controllers/LogAbsenController")
const auth = require("../Middleware/AuthMiddleware")
const role = require("../Middleware/RoleMiddleware")

router.post("/scan", auth, role.userCheck, ScannerController.scanQR)

module.exports = router
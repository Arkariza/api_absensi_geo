const express = require("express")
const router = express.Router()

const QrController = require("../Controllers/QrController")
const auth = require("../Middleware/AuthMiddleware")
const role = require("../Middleware/RoleMiddleware")

router.post("/qr", auth, role.userCheck, QrController.scanQR)

module.exports = router
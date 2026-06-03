const express = require("express")
const router = express.Router()

const QrController = require("../Controllers/QrController")
const auth = require("../Middleware/AuthMiddleware")
const role = require("../Middleware/RoleMiddleware")

router.get("/qr", auth, role.userCheck, QrController.buatKodeQR)

module.exports = router
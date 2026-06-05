const express = require("express")
const router = express.Router()

const QrController = require("../Controllers/QrController")
const auth = require("../Middleware/AuthMiddleware")
const role = require("../Middleware/RoleMiddleware")

router.get("/qr", auth, QrController.buatKodeQR)

module.exports = router
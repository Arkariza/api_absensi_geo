const express = require("express")
const router = express.Router()

const ScannerController = require("../Controllers/LogAbsenController")
const auth = require("../Middleware/AuthMiddleware")
const role = require("../Middleware/RoleMiddleware")

router.post("/scan", (req, res) => {
  return res.status(200).json({
    message: "ROUTE SCANNER BARU KEBACA",
    body: req.body,
    waktu: new Date(),
  })
})

module.exports = router
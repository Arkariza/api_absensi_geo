const express = require("express")
const router = express.Router()

const auth = require("../Middleware/AuthMiddleware")
const role = require("../Middleware/RoleMiddleware")
const userController = require("../Controllers/UserController")
const upload = require("../Middleware/UploadImage")


router.post("/izin", auth, role.userOrKetuaKelas, upload.single("bukti_keterangan"), userController.kirimIzin)
router.post("/ketua-hadir", auth, role.ketuaKelasCheck, userController.absenKetuaKelas)
router.get("/histori", auth, role.userOrKetuaKelas, userController.getHistoriAbsen)


module.exports = router
const db = require("../Config/db")
const crypto = require("crypto")

const SECRET = process.env.JWT_SECRET || "JWT_TOKEN"

exports.scanQR = async (req, res) => {
    try {
        const userId = req.user.id
        const { qr } = req.body

        if (!qr) {
            return res.status(400).json({ message: "QR kosong" })
        }

        const parts = qr.split(":")

        if (parts.length !== 2) {
            return res.status(400).json({ message: "Format QR invalid" })
        }

        const [data, hash] = parts

        if (data !== "QR_ABSENSI_ADMIN") {
            return res.status(400).json({ message: "QR bukan QR absensi admin" })
        }

        const validHash = crypto
            .createHmac("sha256", SECRET)
            .update(data)
            .digest("hex")

        if (hash !== validHash) {
            return res.status(400).json({ message: "QR tidak valid" })
        }

        const [already] = await db.query(
            `SELECT id 
             FROM log_absen 
             WHERE idUser = ? 
             AND DATE(absen) = CURDATE()`,
            [userId]
        )

        if (already.length > 0) {
            return res.status(400).json({
                message: "Kamu sudah absen hari ini"
            })
        }

        await db.query(
            `INSERT INTO log_absen 
             (idUser, absen, status)
             VALUES (?, NOW(), ?)`,
            [userId, "hadir"]
        )

        return res.json({
            message: "Absen berhasil",
            waktu: new Date()
        })

    } catch (error) {
        return res.status(500).json({
            message: "Absen gagal",
            error: error.message
        })
    }
}
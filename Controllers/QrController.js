const db = require("../Config/db")
const crypto = require("crypto")

const SECRET = process.env.JWT_SECRET || "JWT_TOKEN"
const QR_DATA = "QR_ABSENSI_ADMIN"

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

        if (data !== QR_DATA) {
            return res.status(400).json({
                message: "QR bukan QR absensi admin",
            })
        }

        const validHash = crypto
            .createHmac("sha256", SECRET)
            .update(QR_DATA)
            .digest("hex")

        if (hash !== validHash) {
            return res.status(400).json({
                message: "QR tidak valid",
            })
        }

        const userResult = await db.query(
            "SELECT id, username FROM users WHERE id = $1",
            [userId]
        )

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User tidak ditemukan",
            })
        }

        const alreadyResult = await db.query(
            `SELECT id
             FROM log_absen
             WHERE iduser = $1
             AND DATE(absen) = CURRENT_DATE`,
            [userId]
        )

        if (alreadyResult.rows.length > 0) {
            return res.status(400).json({
                message: "Kamu sudah absen hari ini",
            })
        }

        await db.query(
            `INSERT INTO log_absen (iduser, absen, status)
             VALUES ($1, NOW(), $2)`,
            [userId, "hadir"]
        )

        return res.status(201).json({
            message: "Absen berhasil",
            user: userResult.rows[0],
            waktu: new Date(),
        })
    } catch (error) {
        return res.status(500).json({
            message: "Absen gagal",
            error: error.message,
        })
    }
}
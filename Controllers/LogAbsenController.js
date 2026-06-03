const db = require("../Config/db")
const crypto = require("crypto")

const SECRET = "JWT_TOKEN"

exports.scanQR = async (req, res) => {
    try {
        const { qr } = req.body

        if (!qr) {
            return res.status(400).json({ message: "QR kosong" })
        }

        const parts = qr.split(":")

        if (parts.length !== 3) {
            return res.status(400).json({ message: "Format QR Invalid" })
        }

        const [userId, timestamp, hash] = parts

        const validHash = crypto
            .createHmac("sha256", SECRET)
            .update(`${userId}:${timestamp}`)
            .digest("hex")

        if (hash !== validHash) {
            return res.status(400).json({ message: "QR gak Valid" })
        }

        const now = Date.now()
        const maxAge = 2 * 60 * 60 * 1000

        if (now - Number(timestamp) > maxAge) {
            return res.status(400).json({ message: "QR Expire, Silahkan Restart" })
        }

        const userResult = await db.query(
            "SELECT id, username FROM users WHERE id = $1",
            [userId]
        )

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User gak ditemukan" })
        }

        const alreadyResult = await db.query(
            `SELECT id
             FROM log_absen
             WHERE iduser = $1
             AND DATE(absen) = CURRENT_DATE`,
            [userId]
        )

        if (alreadyResult.rows.length > 0) {
            return res.status(400).json({ message: "User ini sudah Absen" })
        }

        await db.query(
            `INSERT INTO log_absen (iduser, absen, status)
             VALUES ($1, NOW(), $2)`,
            [userId, "hadir"]
        )

        return res.json({
            message: "Absen berhasil",
            user: userResult.rows[0],
            waktu: new Date()
        })
    } catch (error) {
        return res.status(500).json({
            message: "Absen Gagal",
            error: error.message
        })
    }
}
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

        const now = new Date()

        const startOfDay = new Date(now)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(now)
        endOfDay.setHours(23, 59, 59, 999)

        const { data: already, error: checkError } = await db
            .from("log_absen")
            .select("id")
            .eq("idUser", userId)
            .gte("absen", startOfDay.toISOString())
            .lte("absen", endOfDay.toISOString())
            .limit(1)

        if (checkError) {
            return res.status(500).json({
                message: "Gagal cek data absen",
                error: checkError.message,
            })
        }

        if (already && already.length > 0) {
            return res.status(400).json({
                message: "Kamu sudah absen hari ini",
            })
        }

        const { error: insertError } = await db
            .from("log_absen")
            .insert([
                {
                    idUser: userId,
                    absen: now.toISOString(),
                    status: "hadir",
                },
            ])

        if (insertError) {
            return res.status(500).json({
                message: "Gagal menyimpan absen",
                error: insertError.message,
            })
        }

        return res.json({
            message: "Absen berhasil",
            waktu: now,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Absen gagal",
            error: error.message,
        })
    }
}
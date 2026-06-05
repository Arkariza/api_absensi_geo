const crypto = require("crypto")

const SECRET = process.env.JWT_SECRET || "JWT_TOKEN"
const QR_DATA = "QR_ABSENSI_ADMIN"

exports.buatKodeQR = (req, res) => {
    try {
        const hash = crypto
            .createHmac("sha256", SECRET)
            .update(QR_DATA)
            .digest("hex")

        const qrPayLoad = `${QR_DATA}:${hash}`

        return res.json({
            message: "QR Admin berhasil di-load",
            qr: qrPayLoad,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Gagal load QR Admin",
            error: error.message,
        })
    }
}
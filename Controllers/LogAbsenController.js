const crypto = require("crypto")

const SECRET = process.env.JWT_SECRET || "JWT_TOKEN"

exports.buatKodeQR = (req, res) => {
    try {
        const data = "QR_ABSENSI_ADMIN"

        const hash = crypto
            .createHmac("sha256", SECRET)
            .update(data)
            .digest("hex")

        const qrPayLoad = `${data}:${hash}`

        return res.json({
            message: "QR Admin berhasil di-load",
            qr: qrPayLoad
        })

    } catch (error) {
        return res.status(500).json({
            message: "Gagal load QR Admin",
            error: error.message
        })
    }
}
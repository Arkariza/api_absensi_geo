const SECRET = "JWT_TOKEN"
const crypto = require("crypto")

exports.buatKodeQR = (req, res) => {
    try {
        const userId = req.user.id
        const timestamp = Date.now()

        const data = `${userId}:${timestamp}`

        const hash = crypto
            .createHmac("sha256", SECRET)
            .update(data)
            .digest("hex")

        const qrPayLoad = `${data}:${hash}`

        return res.json({
            message: "QR berhasil di Load",
            qr: qrPayLoad,
        })

    } catch (error) {
        return res.status(500).json({
            message: "gagal load QR",
            error: error.message,
        })
    }
}
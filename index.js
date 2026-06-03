const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()
require("./Corn/AutoAlpha")
const app = express()
app.set("trust proxy", 1)
app.use(helmet())
app.use(express.json())
app.use("/uploads", express.static("uploads"))


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Terlalu banyak percobaan login"
})

app.use("/api/auth/login", loginLimiter)

app.use(cors({
    origin: function (origin, callback) {
        callback(null, true)
    },
    credentials: true
}))

const loginRoute = require("./Routes/LoginRoute")
const logAbsen = require("./Routes/LogAbsenR")
const qrRoute = require("./Routes/QRroute")
const scannerQr = require("./Routes/ScannerR")
const userAkses = require("./Routes/UserRoute")

app.use("/api/auth", loginRoute)
app.use("/api/admin-only", logAbsen)
app.use("/api/kode-qr", qrRoute)
app.use("/api/scanner", scannerQr)
app.use("/api/user-akses", userAkses)

app.get("/", (req, res) => {
    res.send("Backend Absensi Running")
})

// app.get("/ping", (req, res) => {
//     return res.status(200).json({
//         message: "pong",
//         uptime: process.uptime(),
//         timestamp: new Date()
//     })
// })

const PORT = process.env.PORT || 3050

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
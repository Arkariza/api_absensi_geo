const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()
require("./Corn/AutoAlpha")

const app = express()

app.set("trust proxy", 1)

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true)
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))

app.use(helmet())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Terlalu banyak percobaan login",
})

app.use("/api/auth/login", loginLimiter)

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

const PORT = process.env.PORT || 3050

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

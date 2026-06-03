const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
require("./Corn/AutoAlpha");

const app = express();

app.set("trust proxy", 1);

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// CORS WAJIB PALING ATAS
app.use(cors(corsOptions));

// HANDLE PREFLIGHT MANUAL, SEBELUM LIMITER / ROUTES
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Terlalu banyak percobaan login",
  skip: (req) => req.method === "OPTIONS",
});

app.use("/api/auth/login", loginLimiter);

const loginRoute = require("./Routes/LoginRoute");
const logAbsen = require("./Routes/LogAbsenR");
const qrRoute = require("./Routes/QRroute");
const scannerQr = require("./Routes/ScannerR");
const userAkses = require("./Routes/UserRoute");

app.use("/api/auth", loginRoute);
app.use("/api/admin-only", logAbsen);
app.use("/api/kode-qr", qrRoute);
app.use("/api/scanner", scannerQr);
app.use("/api/user-akses", userAkses);

app.get("/", (req, res) => {
  res.send("Backend Absensi Running");
});

const PORT = process.env.PORT || 3050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

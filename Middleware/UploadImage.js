const multer = require("multer")
const path = require("path")
const fs = require("fs")

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads")
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },

    filename: (req, file, cb) => {
        const unique =
            Date.now() + "-" + Math.round(Math.random() * 1e9)

        cb(
            null,
            unique + path.extname(file.originalname)
        )
    }
})

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowed = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp",
            "image/heic",
            "image/heif"
        ]

        if (!allowed.includes(file.mimetype)) {
            return cb(
                new Error("Format file harus gambar")
            )
        }

        cb(null, true)
    }
})

module.exports = upload
const pool = require("../Config/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) throw new Error("JWT_SECRET belum di set")

const SALT_ROUNDS = 12

module.exports = {
    register: async (req, res, next) => {
        try {
            const { username, pin, no_hp, nama_jurusan } = req.body
            const pinStr = pin?.toString()

            if (!username || !pin) {
                return res.status(400).json({ message: "username & pin wajib" })
            }

            if (pinStr.length !== 6) {
                return res.status(400).json({ message: "pin harus memiliki 6 angka" })
            }

            const existingResult = await pool.query(
                "SELECT id FROM users WHERE username = $1",
                [username]
            )

            if (existingResult.rows.length > 0) {
                return res.status(409).json({ message: "Username sudah terdaftar" })
            }

            const hashed = await bcrypt.hash(pinStr, SALT_ROUNDS)

            const insertResult = await pool.query(
                `INSERT INTO users (username, no_hp, nama_jurusan, pin)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id`,
                [username, no_hp || null, nama_jurusan || null, hashed]
            )

            const insertId = insertResult.rows[0].id

            return res.status(201).json({
                id: insertId,
                username,
                no_hp: no_hp || null,
                nama_jurusan: nama_jurusan || null
            })
        } catch (err) {
            next(err)
        }
    },

    login: async (req, res, next) => {
        try {
            const { username, pin } = req.body

            if (!username || !pin) {
                return res.status(400).json({ message: "username & pin wajib" })
            }

            const usernameClean = username.trim()
            const pinClean = pin.toString().trim()

            const result = await pool.query(
                `SELECT id, username, pin, role_id, nama_jurusan, no_hp
             FROM users
             WHERE LOWER(username) = LOWER($1)`,
                [usernameClean]
            )

            if (result.rows.length === 0) {
                return res.status(401).json({ message: "Nama Salah" })
            }

            const user = result.rows[0]

            const match = await bcrypt.compare(pinClean, user.pin)

            if (!match) {
                return res.status(401).json({ message: "Pin Salah" })
            }

            const payload = {
                id: user.id,
                username: user.username,
                role_id: user.role_id
            }

            const token = jwt.sign(payload, jwtSecret, { expiresIn: "2h" })

            return res.json({
                message: "Login berhasil",
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    no_hp: user.no_hp,
                    role_id: user.role_id,
                    nama_jurusan: user.nama_jurusan
                }
            })

        } catch (err) {
            next(err)
        }
    },

    updatePin: async (req, res, next) => {
        try {
            const { oldPin, newPin } = req.body
            const userId = req.user.id

            if (!oldPin || !newPin) {
                return res.status(400).json({ message: "oldPin & newPin wajib" })
            }

            if (newPin.toString().length !== 6) {
                return res.status(400).json({ message: "PIN baru harus 6 digit" })
            }

            const result = await pool.query(
                "SELECT id, pin FROM users WHERE id = $1",
                [userId]
            )

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "User tidak ditemukan" })
            }

            const user = result.rows[0]

            const match = await bcrypt.compare(oldPin.toString(), user.pin)

            if (!match) {
                return res.status(400).json({ message: "PIN lama salah" })
            }

            const hashed = await bcrypt.hash(newPin.toString(), SALT_ROUNDS)

            const updateResult = await pool.query(
                "UPDATE users SET pin = $1 WHERE id = $2",
                [hashed, userId]
            )

            if (updateResult.rowCount === 0) {
                return res.status(404).json({ message: "User tidak ditemukan" })
            }

            return res.json({ message: "PIN berhasil diupdate" })
        } catch (err) {
            next(err)
        }
    },

    getProfile: async (req, res, next) => {
        try {
            const result = await pool.query(
                `SELECT username, no_hp, nama_jurusan
                 FROM users
                 WHERE id = $1`,
                [req.user.id]
            )

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "User tidak ditemukan" })
            }

            return res.json({
                message: "Profile berhasil diambil",
                user: result.rows[0]
            })
        } catch (err) {
            next(err)
        }
    }
}
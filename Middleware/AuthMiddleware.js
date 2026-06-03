const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtSecret = process.env.JWT_SECRET

module.exports = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization')

        if (!authHeader) {
            return res.status(401).json({ message: 'Token tidak ditemukan' })
        }

        const parts = authHeader.split(' ')

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ message: 'Format token salah' })
        }

        const token = parts[1]

        const decoded = jwt.verify(token, jwtSecret)

        req.user = {
            id: decoded.id,
            username: decoded.username,
            role_id: decoded.role_id
        }

        next()
    } catch (err) {
        return res.status(401).json({ message: 'Token tidak valid' })
    }
}
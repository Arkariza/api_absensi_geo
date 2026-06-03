const express = require ('express')

exports.validateLogin = (req, res, next) => {
    const { username, pin } = req.body

    if (!username || !pin) {
        return res.status(400).json({message: "username dan pin wajib diisi"})
    }

    if (typeof pin !== "string" && typeof pin !== "number") {
        return res.status(400).json({message: "pin harus berupa angka"})
    }

    if (pin.toString().length !== 6) {
        return res.status(400).json({message: "pin harus 6 digit"})
    }
    next()
}

exports.validateRegister = (req, res, next) => {
    const { username, pin, name } = req.body

    if (!username || !pin) {
        return res.status(400).json({message: "username dan pin wajib"})
    }

    if (username.length < 3) {
        return res.status(400).json({message: "username minimal 3 karakter"})
    }

    if (pin.toString().length !== 6) {
        return res.status(400).json({message: "pin harus 6 digit"})
    }
    next()
}

exports.validateScanQR = (req, res, next) => {
    const { qr } = req.body

    if (!qr) {
        return res.status(400).json({message: "QR wajib diisi"})
    }

    if (typeof qr !== "string") {
        return res.status(400).json({message: "QR harus berupa string"})
    }

    const parts = qr.split(":")

    if (parts.length !== 3) {
        return res.status(400).json({message: "Format QR tidak valid"})
    }
    next()
}

exports.validateUpdatePin = (req, res, next) => {
    const { oldPin, newPin } = req.body;

    if (!oldPin || !newPin) {
        return res.status(400).json({message: "oldPin dan newPin wajib diisi"})
    }

    if (newPin.toString().length !== 6) {
        return res.status(400).json({message: "PIN baru harus 6 digit"})
    }
    next()
}
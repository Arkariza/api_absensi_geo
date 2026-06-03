const express = require ('express')

function adminCheck(req, res, next) {
    if (req.user.role_id === 1) {
        return next()
    }
    return res.status(403).json({ message: "Akses ditolak (Admin only)" })
}

function userCheck(req, res, next) {
    if (req.user.role_id === 2 ) {
        return next ()
    }
    return res.status(403).json({Message : "Silahkan Login Terlebih Dahulu."})
}

function ketuaKelasCheck(req, res, next) {

    if (req.user.role_id === 3) {
        return next()
    }

    return res.status(403).json({
        message: "Akses ditolak (ketua jurusan only)"
    })
}

function userOrKetuaKelas(req, res, next) {

    if (
        req.user.role_id === 2 ||
        req.user.role_id === 3
    ) {
        return next()
    }

    return res.status(403).json({
        message: "Akses ditolak"
    })
}

function adminOrKetuaKelas(req, res, next) {

    if (
        req.user.role_id === 1 ||
        req.user.role_id === 3
    ) {
        return next()
    }

    return res.status(403).json({
        message: "Akses ditolak"
    })
}

module.exports = {adminCheck, userCheck, ketuaKelasCheck, userOrKetuaKelas, adminOrKetuaKelas}
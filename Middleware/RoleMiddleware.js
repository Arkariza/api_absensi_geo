function getRoleId(req) {
    return Number(
        req.user?.role_id ||
        req.user?.roleId ||
        req.user?.role ||
        req.user?.id_role
    )
}

function adminCheck(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Token tidak valid" })
    }

    const roleId = getRoleId(req)

    if (roleId === 1) {
        return next()
    }

    return res.status(403).json({
        message: "Akses ditolak (Admin only)",
        role_yang_dibaca: req.user,
    })
}

function userCheck(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Token tidak valid" })
    }

    const roleId = getRoleId(req)

    console.log("ROLE USER CHECK:", {
        roleId,
        user: req.user,
    })

    if (roleId === 2) {
        return next()
    }

    return res.status(403).json({
        message: "Akses ditolak, hanya user yang boleh scan QR",
        role_yang_dibaca: req.user,
    })
}

function ketuaKelasCheck(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Token tidak valid" })
    }

    const roleId = getRoleId(req)

    if (roleId === 3) {
        return next()
    }

    return res.status(403).json({
        message: "Akses ditolak (ketua kelas only)",
        role_yang_dibaca: req.user,
    })
}

function userOrKetuaKelas(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Token tidak valid" })
    }

    const roleId = getRoleId(req)

    if (roleId === 2 || roleId === 3) {
        return next()
    }

    return res.status(403).json({
        message: "Akses ditolak",
        role_yang_dibaca: req.user,
    })
}

function adminOrKetuaKelas(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Token tidak valid" })
    }

    const roleId = getRoleId(req)

    if (roleId === 1 || roleId === 3) {
        return next()
    }

    return res.status(403).json({
        message: "Akses ditolak",
        role_yang_dibaca: req.user,
    })
}

module.exports = {
    adminCheck,
    userCheck,
    ketuaKelasCheck,
    userOrKetuaKelas,
    adminOrKetuaKelas,
}
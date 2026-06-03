const db = require("../Config/db")

function withImageUrl(req, logs) {
    return logs.map((log) => ({
        ...log,
        bukti_url: log.bukti_keterangan
            ? `${req.protocol}://${req.get("host")}${log.bukti_keterangan}`
            : null
    }))
}

exports.getLogs = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                l.id,
                u.username,
                u.no_hp,
                u.nama_jurusan,
                l.absen,
                l.status,
                l.detail_keterangan,
                l.bukti_keterangan
             FROM log_absen l
             JOIN users u ON u.id = l.iduser
             ORDER BY l.absen DESC`
        )

        res.json({
            message: "Data Absensi berhasil di load",
            data: withImageUrl(req, result.rows)
        })

    } catch (error) {
        res.status(500).json({
            message: "Data Absensi Gagal di load",
            error: error.message
        })
    }
}

exports.getLogsByUser = async (req, res) => {
    try {
        const { id } = req.params

        const result = await db.query(
            `SELECT 
                l.id,
                u.username,
                u.no_hp,
                u.nama_jurusan,
                l.absen,
                l.status,
                l.detail_keterangan,
                l.bukti_keterangan
             FROM log_absen l
             JOIN users u ON u.id = l.iduser
             WHERE u.id = $1
             ORDER BY l.absen DESC`,
            [id]
        )

        res.json({
            message: "Berhasil ambil log user",
            data: withImageUrl(req, result.rows)
        })

    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan",
            error: error.message
        })
    }
}

exports.getTodayLogs = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                l.id,
                u.username,
                u.no_hp,
                u.nama_jurusan,
                l.absen,
                l.status,
                l.detail_keterangan,
                l.bukti_keterangan
             FROM log_absen l
             JOIN users u ON u.id = l.iduser
             WHERE DATE(l.absen) = CURRENT_DATE
             ORDER BY l.absen DESC`
        )

        res.json({
            message: "Log absensi hari ini",
            data: withImageUrl(req, result.rows)
        })

    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan",
            error: error.message
        })
    }
}
const db = require("../Config/db")

module.exports = {
    kirimIzin: async (req, res) => {
        try {
            const userId = req.user.id
            const { status, detail_keterangan } = req.body

            if (!["izin", "sakit"].includes(status)) {
                return res.status(400).json({
                    message: "status tidak valid"
                })
            }

            const bukti_keterangan = req.file
                ? `/uploads/${req.file.filename}`
                : null

            const alreadyResult = await db.query(
                `SELECT id 
                 FROM log_absen 
                 WHERE iduser = $1
                 AND DATE(absen) = CURRENT_DATE`,
                [userId]
            )

            if (alreadyResult.rows.length > 0) {
                return res.status(400).json({
                    message: "hari ini telah mengisi absensi"
                })
            }

            await db.query(
                `INSERT INTO log_absen 
                (
                    iduser,
                    absen,
                    status,
                    detail_keterangan,
                    bukti_keterangan
                ) 
                VALUES ($1, NOW(), $2, $3, $4)`,
                [
                    userId,
                    status,
                    detail_keterangan || null,
                    bukti_keterangan
                ]
            )

            return res.json({
                message: `Berhasil dikirim ke Admin ${status}`,
                detail_keterangan: detail_keterangan || null,
                bukti_keterangan,
                image_url: bukti_keterangan
                    ? `${req.protocol}://${req.get("host")}${bukti_keterangan}`
                    : null
            })

        } catch (error) {
            return res.status(500).json({
                message: "gagal mengirim",
                error: error.message
            })
        }
    },

    absenKetuaKelas: async (req, res) => {
        try {
            const userId = req.user.id

            const alreadyResult = await db.query(
                `SELECT id 
                 FROM log_absen 
                 WHERE iduser = $1
                 AND DATE(absen) = CURRENT_DATE`,
                [userId]
            )

            if (alreadyResult.rows.length > 0) {
                return res.status(400).json({
                    message: "hari ini sudah absen"
                })
            }

            await db.query(
                `INSERT INTO log_absen 
                (
                    iduser,
                    absen,
                    status
                )
                VALUES ($1, NOW(), $2)`,
                [
                    userId,
                    "hadir"
                ]
            )

            return res.json({
                message: "Absensi Kepala Jurusan kelas berhasil"
            })

        } catch (error) {
            return res.status(500).json({
                message: "gagal absen",
                error: error.message
            })
        }
    },

    getHistoriAbsen: async (req, res) => {
        try {
            const userId = req.user.id

            const historiResult = await db.query(
                `SELECT 
                    id, 
                    absen, 
                    status,
                    detail_keterangan,
                    bukti_keterangan
                 FROM log_absen 
                 WHERE iduser = $1
                 ORDER BY absen DESC`,
                [userId]
            )

            return res.json({
                message: "behasil mengambil data Absen User",
                data: historiResult.rows
            })

        } catch (error) {
            return res.status(500).json({
                message: "gagal mengambil data absen",
                error: error.message
            })
        }
    }
}
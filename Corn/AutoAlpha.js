const cron = require("node-cron")
const db = require("../Config/db")

cron.schedule("0 23 * * 1-5", async () => {
    try {
        console.log("Auto alpha aktif...")

        const usersResult = await db.query(
            `SELECT id FROM users WHERE role_id = $1`,
            [2]
        )

        const users = usersResult.rows

        for (const user of users) {
            const existsResult = await db.query(
                `SELECT id 
                 FROM log_absen 
                 WHERE iduser = $1
                 AND DATE(absen) = CURRENT_DATE`,
                [user.id]
            )

            if (existsResult.rows.length === 0) {
                await db.query(
                    `INSERT INTO log_absen 
                    (
                        iduser,
                        absen,
                        status
                    ) 
                    VALUES ($1, NOW(), $2)`,
                    [
                        user.id,
                        "alpha"
                    ]
                )

                console.log(`User ${user.id} alpha`)
            }
        }

        console.log("Auto alpha selesai")

    } catch (error) {
        console.log("Auto alpha error:", error.message)
    }

}, {
    timezone: "Asia/Jakarta"
})
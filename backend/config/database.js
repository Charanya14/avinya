const mysql = require("mysql2");
require("dotenv").config();

let db = null;

try {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "osteoporosis_db"
    });

    connection.connect(err => {
        if (err) {
            console.warn("⚠️  MySQL not connected:", err.message);
            console.warn("   Auth features will use demo mode. Predictions still work.\n");
        } else {
            console.log("✅ MySQL Connected");
            db = connection;
        }
    });

    db = connection;
} catch (e) {
    console.warn("⚠️  MySQL unavailable (demo mode active)");
}

module.exports = { db, isConnected: () => db !== null };
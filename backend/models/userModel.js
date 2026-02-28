const { db } = require("../config/database");

// In-memory demo store when DB is unavailable
const demoUsers = [];

exports.createUser = (name, email, password, callback) => {
    if (!db) {
        // Demo mode: store in memory
        demoUsers.push({ id: Date.now(), name, email, password });
        return callback(null, { insertId: demoUsers.length });
    }
    db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password],
        callback
    );
};

exports.findByEmail = (email, callback) => {
    if (!db) {
        // Demo mode: find in memory store
        const found = demoUsers.filter(u => u.email === email);
        return callback(null, found);
    }
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};
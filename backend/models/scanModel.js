const db = require("../config/database");

exports.createScan = (data, callback) => {
    db.query(
        "INSERT INTO scans (user_id,image_path,probability,risk_level,confidence) VALUES (?,?,?,?,?)",
        data,
        callback
    );
};

exports.getUserScans = (userId, callback) => {
    db.query("SELECT * FROM scans WHERE user_id=?", [userId], callback);
};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    User.createUser(name, email, hashed, err => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "User registered successfully" });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, async (err, results) => {
        if (!results.length)
            return res.status(401).json({ message: "Invalid credentials" });

        const valid = await bcrypt.compare(password, results[0].password);
        if (!valid)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET);
        res.json({ token });
    });
};
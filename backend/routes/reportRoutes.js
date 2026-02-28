const express = require("express");
const router = express.Router();
const { getDashboard, getReport } = require("../controllers/reportController");

router.get("/dashboard/:userId", getDashboard);
router.get("/report/:scanId", getReport);

module.exports = router;
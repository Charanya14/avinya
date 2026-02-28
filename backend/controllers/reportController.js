require("dotenv").config();

/**
 * reportController.js — OsteoAI Report Endpoints
 * Returns prediction history stored in the session / demo data.
 * For a full production app, replace with real DB queries.
 */

const demoReports = [
    {
        scanId: "SCAN-001",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        risk_level: "Moderate",
        t_score: -1.8,
        confidence: "67.4%",
        probability: 0.674,
        region: "Lumbar Spine (L1-L4)",
        recommendation: "Schedule a DEXA scan and consult your physician."
    },
    {
        scanId: "SCAN-002",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        risk_level: "Low",
        t_score: -0.6,
        confidence: "91.2%",
        probability: 0.088,
        region: "Hip — Total",
        recommendation: "Maintain a calcium-rich diet and regular exercise."
    }
];

exports.getDashboard = (req, res) => {
    const userId = req.params.userId;
    res.json({
        userId,
        totalScans: demoReports.length,
        lastScan: demoReports[0]?.date || null,
        averageRisk: "Moderate",
        reports: demoReports
    });
};

exports.getReport = (req, res) => {
    const scanId = req.params.scanId;
    const report = demoReports.find(r => r.scanId === scanId);
    if (!report) {
        // Return most recent as fallback
        return res.json(demoReports[0] || { error: "Report not found" });
    }
    res.json(report);
};
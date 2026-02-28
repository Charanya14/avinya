const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { predict } = require("../controllers/predictionController");

/**
 * POST /api/predict/predict
 * Body: multipart/form-data with field "image"
 * Header: Authorization: Bearer <token>  (optional — relaxed for hackathon demo)
 */
router.post("/predict", upload.single("image"), predict);

module.exports = router;
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const MODEL_PATH = path.resolve(__dirname, "../ai-model/osteoporosis_cnn_model.h5");

exports.ensureModel = () => {
    if (!fs.existsSync(MODEL_PATH)) {
        console.warn("⚠️  Model not found at:", MODEL_PATH);
        console.warn("   Run:  python ai-model/generate_demo_model.py");
        console.warn("   Prediction will use demo fallback results until model is available.\n");
    } else {
        const sizeMB = (fs.statSync(MODEL_PATH).size / (1024 * 1024)).toFixed(2);
        console.log(`✅ AI Model loaded: osteoporosis_cnn_model.h5 (${sizeMB} MB)`);
    }
};
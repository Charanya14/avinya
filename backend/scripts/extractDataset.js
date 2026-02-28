/**
 * ============================================
 * Dataset Extraction Utility
 * ============================================
 * Extracts a ZIP dataset into the proper directory
 * structure for CNN training.
 *
 * Expected ZIP structure:
 *   normal/         X-ray images of healthy bones
 *   osteoporosis/   X-ray images of osteoporotic bones
 *
 * OR any flat ZIP containing images — will be auto-sorted
 * into placeholder folders for manual relabeling.
 */

const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');

const DATASET_BASE = path.join(__dirname, '..', 'dataset', 'osteoporosis');
const NORMAL_DIR = path.join(DATASET_BASE, 'normal');
const OSTEO_DIR = path.join(DATASET_BASE, 'osteoporosis');

/**
 * Extract a ZIP file into dataset/osteoporosis/
 * @param {string} zipFilePath - Absolute path to the uploaded ZIP
 * @returns {{ normalCount, osteoporosisCount, totalExtracted }}
 */
async function extractDataset(zipFilePath) {
    if (!fs.existsSync(zipFilePath)) {
        throw new Error(`ZIP file not found: ${zipFilePath}`);
    }

    // Ensure destination directories exist
    [NORMAL_DIR, OSTEO_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    logger.info(`Extracting dataset ZIP: ${zipFilePath}`);

    const zip = new AdmZip(zipFilePath);
    const entries = zip.getEntries();

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.webp'];
    let normalCount = 0;
    let osteoCount = 0;
    let totalExtracted = 0;

    for (const entry of entries) {
        if (entry.isDirectory) continue;

        const entryName = entry.entryName.toLowerCase();
        const ext = path.extname(entryName);

        if (!imageExtensions.includes(ext)) continue;

        const basename = path.basename(entry.entryName);

        // Detect class from directory structure in ZIP
        let destDir;
        if (entryName.includes('normal/') || entryName.includes('normal\\')) {
            destDir = NORMAL_DIR;
            normalCount++;
        } else if (
            entryName.includes('osteoporosis/') || entryName.includes('osteoporosis\\') ||
            entryName.includes('positive/') || entryName.includes('osteo/')
        ) {
            destDir = OSTEO_DIR;
            osteoCount++;
        } else {
            // Unknown structure — put in normal as placeholder
            destDir = NORMAL_DIR;
            normalCount++;
            logger.warn(`Unknown class for ${entry.entryName} — placed in normal/`);
        }

        const destPath = path.join(destDir, basename);
        fs.writeFileSync(destPath, entry.getData());
        totalExtracted++;
    }

    // Clean up uploaded ZIP
    fs.unlinkSync(zipFilePath);

    logger.info(`Dataset extracted: ${normalCount} normal, ${osteoCount} osteoporosis images`);

    return {
        normalCount,
        osteoporosisCount: osteoCount,
        totalExtracted,
        normalDir: NORMAL_DIR,
        osteoporosisDir: OSTEO_DIR,
        message: totalExtracted > 0
            ? `Successfully extracted ${totalExtracted} images. Ready for training.`
            : 'No images found in ZIP. Check ZIP structure.'
    };
}

module.exports = { extractDataset };

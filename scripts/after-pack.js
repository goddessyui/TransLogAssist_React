// scripts/after-pack.js

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Calculates the SHA-256 hash of a file using streams for efficiency.
 * @param {string} filePath The absolute path to the file.
 * @returns {Promise<string>} A promise that resolves with the hex-encoded hash.
 */
function calculateHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
}

/**
 * Default export for the electron-builder afterPack hook.
 * @param {object} context The context object provided by electron-builder.
 */
exports.default = async function(context) {
  console.log('--- [afterPack hook] Start: Calculating app.asar hash ---');
  
  const { appOutDir } = context;
  const asarPath = path.join(appOutDir, 'resources', 'app.asar');
  const markerPath = path.join(appOutDir, 'resources', '_build_marker.json');

  if (!fs.existsSync(asarPath)) {
    const errorMessage = `Error: app.asar not found at path: ${asarPath}. Cannot create integrity hash.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const hash = await calculateHash(asarPath);
    console.log(`  > Calculated hash for app.asar: ${hash}`);

    const markerData = { hash };
    fs.writeFileSync(markerPath, JSON.stringify(markerData, null, 2));
    console.log(`  > Wrote hash to ${markerPath}`);
  } catch (error) {
    console.error(`  > Failed to generate and write hash: ${error}`);
    throw error;
  }

  console.log('--- [afterPack hook] Finish: Hash calculation complete ---');
};

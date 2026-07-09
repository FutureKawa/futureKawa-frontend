'use strict';

const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'reports', 'screenshots');

/**
 * Sauvegarde une capture d'écran lorsque le test Mocha qui vient de s'exécuter a échoué.
 * À appeler dans un hook `afterEach` avec `this.currentTest`.
 * Ne fait jamais échouer la suite (la capture est un "best effort" de debug),
 * et n'a aucun effet si le test a réussi.
 */
async function saveScreenshotOnFailure(driver, mochaTest) {
  if (!driver || !mochaTest || mochaTest.state !== 'failed') {
    return;
  }

  try {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

    const safeTitle = mochaTest
      .fullTitle()
      .replace(/[^a-z0-9]+/gi, '_')
      .toLowerCase();
    const filePath = path.join(SCREENSHOTS_DIR, `${safeTitle}.png`);

    const base64Image = await driver.takeScreenshot();
    fs.writeFileSync(filePath, base64Image, 'base64');

    console.log(`[selenium] Capture d'écran enregistrée : ${filePath}`);
  } catch (err) {
    console.warn(`[selenium] Impossible d'enregistrer la capture d'écran : ${err.message}`);
  }
}

module.exports = { saveScreenshotOnFailure };

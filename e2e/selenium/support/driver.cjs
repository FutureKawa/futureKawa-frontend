'use strict';

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { IMPLICIT_TIMEOUT } = require('./config.cjs');

/**
 * Détermine si Chrome doit être lancé en mode headless.
 * Headless par défaut (local ET CI) pour ne pas nécessiter d'environnement graphique.
 * Peut être désactivé en local avec `SELENIUM_HEADLESS=false` pour déboguer visuellement.
 */
function isHeadless() {
  return process.env.SELENIUM_HEADLESS !== 'false';
}

/**
 * Construit une instance de Chrome WebDriver prête à être utilisée dans les specs.
 *
 * - `--headless=new` : nouveau mode headless de Chrome (plus fiable que l'ancien `--headless`).
 * - `--no-sandbox` / `--disable-dev-shm-usage` : obligatoires sur les runners CI (conteneurs Linux),
 *   sans quoi Chrome plante au démarrage faute de /dev/shm suffisant ou de droits sandbox.
 * - `--disable-gpu` : évite des erreurs de rendu GPU inutiles en environnement headless/CI.
 * - `--window-size` : fige une taille de fenêtre déterministe (utile pour la mise en page responsive).
 */
async function createDriver() {
  const options = new chrome.Options();

  if (isHeadless()) {
    options.addArguments('--headless=new');
  }

  options.addArguments(
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--window-size=1440,900',
  );

  // Permet de pointer explicitement vers le binaire Chrome installé par la CI
  // (ex: browser-actions/setup-chrome fournit son propre chemin, différent du Chrome
  // parfois déjà préinstallé sur l'image GitHub-hosted).
  if (process.env.CHROME_BIN) {
    options.setChromeBinaryPath(process.env.CHROME_BIN);
  }

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({ implicit: IMPLICIT_TIMEOUT });

  return driver;
}

module.exports = { createDriver };

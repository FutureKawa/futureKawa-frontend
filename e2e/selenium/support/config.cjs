'use strict';

/**
 * Configuration centralisée des tests Selenium.
 * Toutes les valeurs peuvent être surchargées via des variables d'environnement,
 * ce qui permet d'utiliser exactement le même code en local et dans la CI.
 */

const BASE_URL = process.env.E2E_BASE_URL || 'http://127.0.0.1:4200';

// Délai maximum (ms) d'attente explicite pour qu'un élément apparaisse / qu'une URL change.
const EXPLICIT_TIMEOUT = Number(process.env.E2E_EXPLICIT_TIMEOUT_MS || 10000);

// Délai d'attente implicite (ms) appliqué par défaut par le driver Selenium.
const IMPLICIT_TIMEOUT = Number(process.env.E2E_IMPLICIT_TIMEOUT_MS || 2000);

module.exports = {
  BASE_URL,
  EXPLICIT_TIMEOUT,
  IMPLICIT_TIMEOUT,
};

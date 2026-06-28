'use strict';

const { expect } = require('chai');
const { By, until } = require('selenium-webdriver');
const { createDriver } = require('../support/driver.cjs');
const { saveScreenshotOnFailure } = require('../support/screenshot.cjs');
const { BASE_URL, EXPLICIT_TIMEOUT } = require('../support/config.cjs');

/**
 * Vérifie la navigation réelle au clic dans la sidebar (Angular Router),
 * conformément aux routes déclarées dans src/app/app.routes.ts.
 *
 * On cible les liens via leur attribut `href` (généré par la directive RouterLink
 * d'Angular), ce qui est plus robuste qu'un sélecteur basé sur les classes CSS
 * ou sur l'attribut `routerLink`, qui n'est pas garanti d'être préservé dans le DOM
 * compilé.
 */
describe('Navigation principale via la sidebar (Selenium)', function () {
  let driver;

  before(async function () {
    driver = await createDriver();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  afterEach(async function () {
    await saveScreenshotOnFailure(driver, this.currentTest);
  });

  it('navigue de Welcome vers Dashboard en cliquant sur le lien de la sidebar', async function () {
    await driver.get(`${BASE_URL}/welcome`);
    await driver.wait(until.urlContains('/welcome'), EXPLICIT_TIMEOUT);

    const dashboardLink = await driver.wait(
      until.elementLocated(By.css('a.nav-item[href="/dashboard"]')),
      EXPLICIT_TIMEOUT,
    );
    await dashboardLink.click();

    await driver.wait(until.urlContains('/dashboard'), EXPLICIT_TIMEOUT);
    expect(await driver.getCurrentUrl()).to.contain('/dashboard');

    const pageContent = await driver.wait(
      until.elementLocated(By.css('main.page-content')),
      EXPLICIT_TIMEOUT,
    );
    expect(await pageContent.isDisplayed()).to.equal(true);
  });

  it('navigue vers la page Inventory depuis la sidebar', async function () {
    await driver.get(`${BASE_URL}/dashboard`);
    await driver.wait(until.urlContains('/dashboard'), EXPLICIT_TIMEOUT);

    const inventoryLink = await driver.wait(
      until.elementLocated(By.css('a.nav-item[href="/inventory"]')),
      EXPLICIT_TIMEOUT,
    );
    await inventoryLink.click();

    await driver.wait(until.urlContains('/inventory'), EXPLICIT_TIMEOUT);
    expect(await driver.getCurrentUrl()).to.contain('/inventory');
  });

  it('revient sur Welcome en cliquant sur le logo FutureKawa', async function () {
    const logo = await driver.wait(
      until.elementLocated(By.css('.sidebar .logo')),
      EXPLICIT_TIMEOUT,
    );
    await logo.click();

    await driver.wait(until.urlContains('/welcome'), EXPLICIT_TIMEOUT);
    expect(await driver.getCurrentUrl()).to.contain('/welcome');
  });

  it('redirige une route inconnue vers Welcome (route "**")', async function () {
    await driver.get(`${BASE_URL}/route-qui-n-existe-pas`);

    await driver.wait(until.urlContains('/welcome'), EXPLICIT_TIMEOUT);
    expect(await driver.getCurrentUrl()).to.contain('/welcome');
  });
});

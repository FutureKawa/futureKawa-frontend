'use strict';

const { expect } = require('chai');
const { By, until } = require('selenium-webdriver');
const { createDriver } = require('../support/driver.cjs');
const { saveScreenshotOnFailure } = require('../support/screenshot.cjs');
const { BASE_URL, EXPLICIT_TIMEOUT } = require('../support/config.cjs');

/**
 * Smoke test : vérifie que l'application Angular bootstrap correctement,
 * que la redirection par défaut ('' -> '/welcome', voir app.routes.ts) fonctionne,
 * et que le layout principal (sidebar + navbar) est bien rendu.
 *
 * Volontairement indépendant du backend Spring Boot : la page Welcome et le
 * layout ne dépendent d'aucun appel API bloquant (cf. SidebarComponent qui
 * retombe sur une liste de pays par défaut en cas d'échec réseau).
 */
describe('Page Welcome (smoke test)', function () {
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

  it("redirige '/' vers '/welcome' et affiche le titre de l'application", async function () {
    await driver.get(`${BASE_URL}/`);

    await driver.wait(until.titleIs('AppKawa'), EXPLICIT_TIMEOUT);
    await driver.wait(until.urlContains('/welcome'), EXPLICIT_TIMEOUT);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.contain('/welcome');
  });

  it('affiche la sidebar avec le logo FutureKawa', async function () {
    await driver.get(`${BASE_URL}/welcome`);

    const sidebar = await driver.wait(
      until.elementLocated(By.css('aside.sidebar')),
      EXPLICIT_TIMEOUT,
    );
    expect(await sidebar.isDisplayed()).to.equal(true);

    const logo = await driver.findElement(By.css('.sidebar .logo'));
    expect((await logo.getText()).trim()).to.equal('FutureKawa');
  });

  it('affiche la navbar (barre de recherche + zone de notifications)', async function () {
    await driver.get(`${BASE_URL}/welcome`);

    const header = await driver.wait(
      until.elementLocated(By.css('header.header')),
      EXPLICIT_TIMEOUT,
    );
    expect(await header.isDisplayed()).to.equal(true);

    const searchInput = await driver.findElement(
      By.css('.search-bar input[type="text"]'),
    );
    expect(await searchInput.isDisplayed()).to.equal(true);
  });
});

const puppeteer = require("puppeteer");

// create list of sites
const stanleySites = require("./data/stanleySites");
const bdSites = require("./data/bdSites");

console.log(stanleySites, bdSites);

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://ar.stanleytools.global/es");
  await page.screenshot({ path: "screenshots/ar.stanleytools.global.png" });
  await browser.close();
})();

const puppeteer = require("puppeteer");
const stanleySites = require("./data/stanleySites");
const bdSites = require("./data/bdSites");
const { generateScreenshot, checkSiteList } = require("./utils/misc");

const main = async () => {
  console.info(`Started running the headless-screenshots node app!`);

  checkSiteList("stanleytools.global", stanleySites);
  checkSiteList("blackandecker.global", bdSites);
  const siteLists = stanleySites.concat(bdSites);
  console.info(
    `Generating screenshots for the ${siteLists.length} urls. This activity will take several minutes... \n`
  );

  puppeteer.launch().then(async browser => {
    await stanleySites.map(async site => {
      const todaysDate = new Date();
      const formattedTodaysDate = `${todaysDate.getFullYear()}_${todaysDate.getMonth() +
        1}_${todaysDate.getDate()}-`;

      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 1024 });

      try {
        await page.goto(`https://${site}`);
      } catch (e) {
        console.error(`Couldn't navigate to https://${site}`);
      }

      try {
        await page.click(".sbd-cookiesBarAgree");
        await page.waitFor(1000);
      } catch (e) {}

      try {
        await page.screenshot({
          path: `screenshots/${formattedTodaysDate}--${site}.png`,
          fullPage: true
        });
        console.log(
          `Generated the screenshot for ${site} to "screenshots/${formattedTodaysDate}--${site}.png"`
        );
      } catch (e) {
        console.error(`Error generating a screenshot for ${site}!`);
        console.error(site, e);
      }
    });

    await browser.close();
  });
};

main();

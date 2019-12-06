const puppeteer = require("puppeteer");
const stanleySites = require("./data/stanleySites");
const bdSites = require("./data/bdSites");
const { checkSiteList } = require("./utils/misc");

const main = async () => {
  let counter = 1;
  console.info(`Started running the headless-screenshots node app!`);

  const todaysDate = new Date();
  const formattedTodaysDate = `${todaysDate.getFullYear()}_${todaysDate.getMonth() +
    1}_${todaysDate.getDate()}-`;

  checkSiteList("stanleytools.global", stanleySites);
  checkSiteList("blackandecker.global", bdSites);

  const browser = await puppeteer.launch();

  stanleySites.map(async site => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1024 });
    await page.goto(`https://${site}`, {
      timeout: 0
    });

    try {
      await page.click(".sbd-cookiesBarAgree");
      await page.waitFor(1000);
    } catch (e) {}

    await page.screenshot({
      path: `screenshots/${formattedTodaysDate}--${site}.png`,
      fullPage: true
    });
    console.log(
      `Generated the 🎑 for ${counter} => "https://${site}" into 📁 => "screenshots/${formattedTodaysDate}--${site}.png"`
    );

    if (counter >= stanleySites.length) {
      console.log("Process is now complete!");
      await browser.close();
    }

    counter++;
  });
};

main();

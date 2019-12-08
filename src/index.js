const puppeteer = require("puppeteer");
const argv = require("minimist")(process.argv.slice(2));
const stanleySites = require("./data/stanleySites");
const bdSites = require("./data/bdSites");
const { checkSiteList } = require("./utils/misc");

const main = async list => {
  const browser = await puppeteer.launch();
  const todaysDate = new Date();
  const formattedTodaysDate = `${todaysDate.getFullYear()}_${todaysDate.getMonth() +
    1}_${todaysDate.getDate()}-`;
  let urlList = null;
  let counter = 1;

  switch (list) {
    case "stanley":
      checkSiteList("stanleytools.global", stanleySites);
      urlList = stanleySites;
      break;
    case "bd":
      checkSiteList("blackandecker.global", bdSites);
      urlList = bdSites;
      break;
    default:
      console.error(
        "You must select a valid list option (--list stanley or --list bd)! "
      );
      process.exit();
      break;
  }

  urlList.map(async site => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1024 });
    await page.goto(`https://${site}`, {
      timeout: 0,
      waitUntil: "networkidle2"
    });

    try {
      await page.click(".sbd-cookiesBarAgree");
      await page.waitFor(1000);
    } catch (e) {
      // handle any errors if the cookie bar is not available
    }

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

console.info(
  `This app will generate 🎑 of the current production SB&D Websites! The process will take several minutes, depending on the power of your 💻.\n`
);

const selectedList = argv.list;
main(selectedList);

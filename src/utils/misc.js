const puppeteer = require("puppeteer");
process.setMaxListeners(0);

exports.checkSiteList = (listName, siteList) => {
  if (siteList.length === 0 || siteList === null) {
    const error = `This list (${listName}) is not valid!`;
    console.error(error);
    return error;
  }

  console.log(
    `The '${listName}' list is valid and has ${siteList.length} urls!`
  );
  return true;
};

exports.generateScreenshot = async site => {
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
};

const chromium = require("chrome-aws-lambda");

interface Props {
  event: {
    url: string;
  };
  context: any;
  callback: any;
}

exports.handler = async (
  event: Props["event"],
  context: Props["context"],
  callback: Props["callback"]
) => {
  let result = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await page.goto(event.url);
    const button = "#pageAction_submit";

    // Wait for suggest overlay to appear and click "show all results".
    await page.type("#cardnumber", "0001234A");
    await page.type("#lastname", "fghefgh");

    await page.waitForSelector(button);
    await page.click(button);

    const textElement = await page.waitForSelector(".error > p");
    const textContent = await textElement?.evaluate(
      (el: { textContent: any }) => el.textContent
    );

    console.log("textContent:", textContent);

    await browser.close();
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return callback(null, result);
};

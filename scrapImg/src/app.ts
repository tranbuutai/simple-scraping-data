import puppeteer from "puppeteer";
import Tesseract from "tesseract.js";
import fs from "fs";
import { text } from "stream/consumers";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  let fileName: string;
  let fileDownloaded = false;
  page.on("response", async (response) => {
    const img_url = response.url();
    console.log(img_url);
    if (img_url.includes("DXB.axd")) {
      response.buffer().then((file) => {
        fileName = "DXB.png";

        const writeStream = fs.createWriteStream(fileName);
        writeStream.write(file);
        fileDownloaded = true;
      });
    }
  });

  await page.goto(
    "https://forms.pfes.nt.gov.au/safent/CheckValidity.aspx?IsValidityCheck=true"
  );

  const imgURL = await page.$eval(
    "#MainContent_pnlCheckValidity_Captcha_IMGD > img",
    (img) => img.src
  );

  // Wait for suggest overlay to appear and click "show all results".
  await page.type("#MainContent_pnlCheckValidity_txtGivenName_I", "Headless");
  await page.type("#MainContent_pnlCheckValidity_txtSurname_I", "asddd");
  await page.type(
    "#MainContent_pnlCheckValidity_txtClearanceNumber_I",
    "12352"
  );
  await page.type(
    "#MainContent_pnlCheckValidity_dteDateOfBirth_I",
    "03/01/2000"
  );

  let captchaText: string;
  await Tesseract.recognize("./DXB.png", "eng", {}).then(
    ({ data: { text } }) => {
      captchaText = text;
      console.log(text);
      return;
    }
  );
  // await page.evaluate(() => {
  //   const button: HTMLElement = document.querySelector(
  //     "#MainContent_pnlCheckValidity_btnCheckValidity_CD"
  //   ) as HTMLElement;
  //   button.click();
  // });

  // await browser.close();
})();

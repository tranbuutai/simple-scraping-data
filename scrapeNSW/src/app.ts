import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://wwccheck.ocg.nsw.gov.au/VerifyIndividual");
  const button = ".waves-effect.waves-dark.btn.btn-primary";

  // Wait for suggest overlay to appear and click "show all results".
  await page.type("#VerifierName", "Headless");
  await page.select("#Reason", "MYOWNCHECK");
  await page.type("#EmailAddress_EmailAddress", "asd@gmail.com");
  await page.type("#EmailAddress_EmailAddressConfirm", "asd@gmail.com");
  await page.type("#VerifierPhone", "012345678");

  await page.waitForSelector(button);
  await page.click(button);

  await page.type("#Name_SingleNameOnly", "asd");
  await page.click("label[for=Name_NoFirstGivenName]");
  await page.click("label[for=Name_NoOtherGivenNames]");
  await page.click("label[for=Name_SingleNameOnly]");
  await page.type("#Name_FamilyName", "asd");
  await page.type("#BirthDate", "02/03/2000");
  await page.click("label[for=applicationNumber]");
  await page.type("#ApplicationNumber", "APP3421222");
  await page.evaluate(() => {
    const button: HTMLElement = document.querySelector(
      ".waves-effect.waves-dark.btn.btn-primary.next-step"
    ) as HTMLElement;
    button.click();
  });

  await page.evaluate(() => {
    const button: HTMLElement = document.querySelector(
      ".waves-effect.waves-dark.btn.btn-primary.g-recaptcha"
    ) as HTMLElement;
    button.click();
  });

  await browser.close();
})();

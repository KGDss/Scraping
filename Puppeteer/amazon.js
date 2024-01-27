const fs = require('fs');
const puppeteer = require("puppeteer");
const random_useragent = require("random-useragent");

const getQuotes = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });

  // Open a new page
  const page = await browser.newPage();
  // await page.setViewport({
  //   width: 1920,
  //   height: 1080,
  // });
  //Setup browser
  await page.setUserAgent(
    random_useragent.getRandom((ua) => {
      return ua.osName === "Windows";
    })
  );

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto(
    "https://www.amazon.com/s?k=amazonbasics&i=computers-intl-ship&ref=nb_sb_noss",
    {
      waitUntil: "domcontentloaded",
    }
  );

  let items = [];
  let pageNum = 1;
  let isBtnDisable = false;
  while (!isBtnDisable) {
    await page.waitForSelector('[data-cel-widget="search_result_0"]');
    const productsHandles = await page.$$(
      "div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
    );

    for (const producthandle of productsHandles) {
      let title = "Null";
      let price = "Null";
      let img = "Null";

      try {
        title = await page.evaluate(
          (el) => el.querySelector("h2 > a > span").textContent,
          producthandle
        );
      } catch (error) {}

      try {
        price = await page.evaluate(
          (el) => el.querySelector(".a-price > .a-offscreen").textContent,
          producthandle
        );
      } catch (error) {}

      try {
        img = await page.evaluate(
          (el) => el.querySelector(".s-image").getAttribute("src"),
          producthandle
        );
      } catch (error) {}
      if (title !== "Null") {
        fs.appendFile('result.csv', `${title.replace(/,/g, ".")}, ${price}, ${img}\n`, function (err){
          if(err) throw err;
        })
      }
    }

    let nextPageExist = true
    try {
      await page.waitForSelector(
        ".s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator",
        { visible: true }
      );
      nextPageExist =
        (await page.$(
          ".s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator"
        )) !== null;
      isBtnDisable = !nextPageExist;
    } catch (e) {
      nextPageExist = false;
      isBtnDisable = true;
    }

    if (nextPageExist) {
      await Promise.all([
        page.click(
          ".s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator"
        ),
        page.waitForNavigation({ waitUntil: "networkidle2" }),
      ]);
      pageNum++;
    }
  }

  items.map((item, index) => {
    console.log(`Item ${index + 1}:`, item);
  });

  // while (!isBtnDisable) {
  //   await page.waitForSelector(".s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator", { visible: true });
  //   const productsHandles = await page.$$(
  //     "div.s-main-slot.s-result-list.s-search-results.sg-row > .sg-col-4-of-24.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.AdHolder.sg-col.s-widget-spacing-small.sg-col-4-of-20"
  //   );
  //   console.log("Page: " + pageNum + "content: " + productsHandles.length)
  //   for (const productHandle of productsHandles) {
  //     let title = "Null";
  //     let price = "Null";
  //     let img = "Null";
  //     try {
  //       //get title
  //       title = await page.evaluate(
  //         (el) => el.querySelector("h2 > a > span").textContent,
  //         productHandle
  //       );
  //     } catch (error) {}

  //     try {
  //       //get price
  //       price = await page.evaluate(
  //         (el) => el.querySelector(".a-price > .a-offscreen").textContent,
  //         productHandle
  //       );
  //     } catch (error) {}

  //     try {
  //       //get img
  //       img = await page.evaluate(
  //         (el) => el.querySelector(".s-image").getAttribute("src"),
  //         productHandle
  //       );
  //     } catch (error) {}
  //      console.log("page " + pageNum + " Title : " + title)
  //     if (title !== "Null") {
  //       items.push({ title, price, img, pageNum });
  //     }
  //   }
  //   // console.log("hello im here");
  //   // console.log(items)
  //   nextPageExist = true
  //   try{
  //     await page.waitForSelector(".s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator", { visible: true });
  //     const nextPageExist =
  //     (await page.$(
  //       ".s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator"
  //     )) !== null;
  //   isBtnDisable = !nextPageExist;
  //   }catch(e){
  //     nextPageExist = false;
  //     isBtnDisable = true;
  //   }

  //   console.log(nextPageExist);
  //   if (nextPageExist) {
  //     await Promise.all([
  //       page.click(".s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator"),
  //       page.waitForNavigation({ waitUntil: "networkidle2" }),
  //     ]);
  //     console.log("move to next page");
  //     pageNum++;
  //   }
  // }
  // items.map((item, index) => {
  //   console.log(`Item ${index + 1}:`, item);
  // });
};

// Start the scraping
getQuotes();

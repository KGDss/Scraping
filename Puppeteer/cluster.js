const { Cluster } = require('puppeteer-cluster');

const urls = []

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 2,
    puppeteer: {headless: false,
      defaultViewport: false,
      userDataDir: "./tmp",}
  });

  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url);
    const screen = await page.screenshot();
    // Store screenshot, do something else
  });

  cluster.queue('http://www.google.com/');
  cluster.queue('http://www.wikipedia.org/');
  // many more pages

  await cluster.idle();
  await cluster.close();
})();
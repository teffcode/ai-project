import puppeteer from "puppeteer";

export const scrapeFoodPage = async (url: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--user-agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'",
    ],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });

    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let scrollHeight = 0;
        const interval = setInterval(() => {
          window.scrollBy(0, 300);
          scrollHeight += 300;
          if (scrollHeight >= document.body.scrollHeight) {
            clearInterval(interval);
            resolve(true);
          }
        }, 300);
      });
    });

    await page.waitForSelector("img", { timeout: 5000 }).catch(() => console.log("No food image found in <img>"));

    const imageUrl = await page.evaluate(() => {
      let largestImg = null;
      let maxSize = 0;

      document.querySelectorAll("img").forEach((img) => {
        const src = img.src || img.getAttribute("data-src") || img.getAttribute("data-lazy-src");
        if (!src) return;

        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        const size = width * height;

        if (size > maxSize) {
          maxSize = size;
          largestImg = src;
        }
      });

      if (!largestImg) {
        document.querySelectorAll("div, span, section").forEach((el) => {
          const bgImage = window.getComputedStyle(el).backgroundImage;
          const match = bgImage.match(/url\(["']?(.*?)["']?\)/);
          if (match && match[1]) {
            largestImg = match[1];
          }
        });
      }

      return largestImg;
    });

    if (!imageUrl) {
      throw new Error("No food image found on the page.");
    }

    console.log("🍔 Extracted Image URL:", imageUrl);
    await browser.close();

    return { imageUrl };
  } catch (error) {
    console.error("❌ Error scraping food page:", error);
    await browser.close();
    throw error;
  }
};

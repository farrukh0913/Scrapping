import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import { chromium } from "playwright";
dotenv.config();

const BASE_URL = process.env.BASE_URL_ZAMEEN || "https://www.zameen.com";

/**
 * Scrape Zameen property listings (with all details)
 * @param {string} citySlug - e.g. 'Multan-15-1' or 'Karachi-2-1'
 * @returns {Promise<Array>} - List of property objects
 */
export const scrapeZameen = async (citySlug = "Multan-15-1") => {
  const url = `${BASE_URL}/Homes/${citySlug}.html`;
  console.log("url: ", url);
  console.log(`🌐 Fetching: ${url}`);

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const listings = $("li[role='article']")
      .map((_, e) => ({
        link:
          "https://www.zameen.com" +
          ($(e).find('[aria-label="Listing link"]').attr("href") || ""),
        image:
          $(e).find('[aria-label="Listing photo"]').attr("src") ||
          $(e).find('[aria-label="Listing photo"]').attr("data-src") ||
          "N/A",
        title:
          $(e).find('[aria-label="Title"]').text().trim() ||
          $(e).find('[aria-label="Listing link"]').attr("title")?.trim() ||
          "N/A",
        beds: $(e).find('[aria-label="Beds"]').text().trim() || "N/A",
        baths: $(e).find('[aria-label="Baths"]').text().trim() || "N/A",
        area: $(e).find('[aria-label="Area"]').text().trim() || "N/A",
        price:
          $(e).find('[aria-label="Price"]').text().trim() ||
          $(e).find("h4").text().trim() ||
          "N/A",
        location: $(e).find('[aria-label="Location"]').text().trim() || "N/A",
        added:
          $(e).find("span[aria-label='Listing creation date']").text().trim() ||
          "N/A",
      }))
      .get();

    console.log(`Scraped ${listings.length} listings`);
    return listings;
  } catch (err) {
    console.error("Scraping failed:", err.message);
    return [];
  }
};

/**
 * Get quotes using Playwright (dynamic JavaScript-rendered page)
 * This demonstrates scraping data from a JS-rendered site using a headless browser.
 * @returns {Promise<void>} - Logs quotes and authors in console
 */
// (async () => {
//   const browser = await chromium.launch({ headless: true });
//   const page = await browser.newPage();

//   const url = "https://quotes.toscrape.com/js/";
//   console.log(`🌐 Visiting: ${url}`);

//   await page.goto(url, { waitUntil: "networkidle" });
//   await page.waitForSelector(".quote");

//   const quotes = await page.$$eval(".quote", (elements) =>
//     elements.map((q) => ({
//       text: q.querySelector(".text")?.textContent.trim(),
//       author: q.querySelector(".author")?.textContent.trim(),
//     }))
//   );

//   console.log(quotes);
//   await browser.close();
// })();

/**
 * Scrape broker (agent) phone number from Zameen listing using Playwright
 * Opens a property page, clicks the "Call" button, waits for the modal,
 * and extracts agent name, phone numbers, and reference ID.
 * @returns {Promise<void>} - Logs agent details in console
 */
// (async () => {
//   const browser = await chromium.launch({ headless: true });
//   const page = await browser.newPage();

//   const url = "https://www.zameen.com/Farm_Houses/Multan-15-1.html";
//   await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

//   const callButton = await page.locator('button[aria-label="Call"]').first();

//   if (!(await callButton.count())) {
//     console.log("Call button not found!");
//     await browser.close();
//     return;
//   }

//   console.log("Clicking 'Call' button...");
//   await callButton.click();

//   const modalSelector = 'div[aria-label="Dialog"]';
//   await page.waitForSelector(modalSelector, { timeout: 10000 });

//   await page.waitForFunction(
//     () => {
//       const links = document.querySelectorAll(
//         'div[aria-label="Dialog"] a[aria-label="Listing phone number"]'
//       );
//       return (
//         links.length > 0 &&
//         Array.from(links).some((a) => a.textContent.trim().length > 0)
//       );
//     },
//     { timeout: 10000 }
//   );

//   console.log("Modal opened & numbers loaded!");

//   const modalData = await page.evaluate(() => {
//     const modal = document.querySelector('div[aria-label="Dialog"]');
//     if (!modal) return null;

//     const agentName =
//       modal.querySelector('[aria-label="Agent Name"]')?.textContent.trim() ||
//       "N/A";

//     const phoneLinks = Array.from(
//       modal.querySelectorAll('a[aria-label="Listing phone number"]')
//     )
//       .map((a) => a.textContent.trim())
//       .filter(Boolean);

//     const refId =
//       modal.querySelector("._9c060afa")?.textContent.trim() || "N/A";

//     return { agentName, phoneNumbers: phoneLinks, referenceId: refId };
//   });

//   console.log("Extracted Info:", modalData);

//   const closeBtn = await page.locator('button[aria-label="Close button"]').first();
//   if (await closeBtn.count()) {
//     await closeBtn.click();
//     console.log("Modal closed.");
//   }

//   await browser.close();
// })();

/**
 * Scrape WhatsApp number from Zameen property listing using Playwright
 * Opens a city listing page, finds and clicks the WhatsApp button,
 * waits for the popup, and extracts the agent’s WhatsApp phone number from the URL.
 * @returns {Promise<void>} - Logs the WhatsApp number in console
 */
// (async () => {
//   const browser = await chromium.launch({ headless: true });
//   const page = await browser.newPage();

//   const url = "https://www.zameen.com/Farm_Houses/Multan-15-1.html";
//   await page.goto(url, { waitUntil: "domcontentloaded", timeout: 5000 });

//   const button = await page.$('button[aria-label="Whatsapp"]');
//   if (!button) {
//     console.log("WhatsApp button NOT found!");
//     await browser.close();
//     return;
//   }

//   console.log("WhatsApp button FOUND! Clicking...");

//   const [popup] = await Promise.all([
//     page.waitForEvent("popup"),
//     button.click(),
//   ]);

//   await popup.waitForTimeout(3000);

//   const popupUrl = popup.url();
//   console.log("Popup URL:", popupUrl);

//   const phoneMatch =
//     popupUrl.match(/[?&]phone=(\d+)/) || popupUrl.match(/wa\.me\/(\d+)/) || [];
//   const phone = phoneMatch[1] || "Not found";

//   console.log("WhatsApp Number:", "+" + phone);

//   await browser.close();
// })();

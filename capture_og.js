import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to exact OG image size
  await page.setViewport({ width: 1200, height: 630 });
  
  // Open the HTML file
  const filePath = `file:///${path.join(__dirname, 'public', 'og.html').replace(/\\/g, '/')}`;
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  
  // Wait for fonts to be confirmed loaded by our script
  await page.waitForSelector('#fonts-loaded');
  
  // Take screenshot
  await page.screenshot({ path: path.join(__dirname, 'public', 'og-image.jpg'), quality: 100, type: 'jpeg' });
  
  await browser.close();
  console.log("Screenshot saved successfully!");
})();

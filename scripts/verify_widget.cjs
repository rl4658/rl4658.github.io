const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const artifactDir = path.resolve('C:/Users/ruife/.gemini/antigravity/brain/af2ac9c5-3336-4351-8fdd-f6ec4c654133');

  // Check /projects
  await page.goto('http://localhost:5173/projects', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollBy(0, 320));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'verify_projects_pixel_perfect.png') });
  console.log('Saved verify_projects_pixel_perfect.png');

  // Check /projects/form-fixer
  await page.goto('http://localhost:5173/projects/form-fixer', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'verify_formfixer_gallery_clean.png') });
  console.log('Saved verify_formfixer_gallery_clean.png');

  await browser.close();
})();

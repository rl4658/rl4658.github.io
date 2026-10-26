const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2 // High-DPI Retina
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/projects...');
  await page.goto('http://localhost:5173/projects', { waitUntil: 'networkidle' });

  // Scroll down to projects section if needed
  await page.waitForTimeout(2000);

  // Locate the FormFixer card
  const formFixerCard = page.locator('text=FormFixer.AI').locator('xpath=ancestor::div[contains(@class, "rounded-3xl")]');
  await formFixerCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const outDir = path.resolve('C:/Users/ruife/.gemini/antigravity/brain/af2ac9c5-3336-4351-8fdd-f6ec4c654133');
  
  // Full card screenshot
  const cardPath = path.join(outDir, 'pw_formfixer_card_final.png');
  await formFixerCard.screenshot({ path: cardPath });
  console.log(`Saved card screenshot to ${cardPath}`);

  // Phone screen close-up
  const phone = formFixerCard.locator('.group\\/phone');
  const phonePath = path.join(outDir, 'pw_formfixer_phone_final.png');
  await phone.screenshot({ path: phonePath });
  console.log(`Saved phone screenshot to ${phonePath}`);

  // Also hover to verify hover state
  await formFixerCard.hover();
  await page.waitForTimeout(600);
  const hoverPath = path.join(outDir, 'pw_formfixer_hover_final.png');
  await formFixerCard.screenshot({ path: hoverPath });
  console.log(`Saved hover screenshot to ${hoverPath}`);

  await browser.close();
  console.log('Verification screenshots complete!');
})();

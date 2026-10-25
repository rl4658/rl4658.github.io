const { chromium } = require("playwright");
const { spawn } = require("child_process");

async function main() {
  const server = spawn("npx.cmd", ["vite", "preview", "--port", "4174"], {
    stdio: "pipe",
    shell: true,
  });

  await new Promise((r) => setTimeout(r, 2000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto("http://localhost:4174/projects", { waitUntil: "networkidle" });

  // Scroll down to view lower cards
  await page.evaluate(() => window.scrollBy(0, 750));
  await page.waitForTimeout(600);

  const lowerCardsScreenshot = "C:/Users/ruife/.gemini/antigravity/brain/af2ac9c5-3336-4351-8fdd-f6ec4c654133/projects_lower_cards.png";
  await page.screenshot({ path: lowerCardsScreenshot });
  console.log("Saved lower cards screenshot:", lowerCardsScreenshot);

  await browser.close();
  server.kill();
}

main().catch((err) => {
  console.error("Scroll test failed:", err);
  process.exit(1);
});

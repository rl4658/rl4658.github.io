const { chromium } = require("playwright");
const { spawn } = require("child_process");

async function main() {
  console.log("Starting vite preview on port 4173...");
  const server = spawn("npx.cmd", ["vite", "preview", "--port", "4173"], {
    stdio: "pipe",
    shell: true,
  });

  await new Promise((r) => setTimeout(r, 2500));

  console.log("Launching Chromium via Playwright...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 950 },
  });
  const page = await context.newPage();

  // 1. Check Homepage
  console.log("1. Visiting Homepage...");
  await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "C:/Users/ruife/.gemini/antigravity/brain/af2ac9c5-3336-4351-8fdd-f6ec4c654133/verify_homepage.png",
  });

  // 2. Check Projects Lab
  console.log("2. Visiting Projects Lab...");
  await page.goto("http://localhost:4173/projects", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "C:/Users/ruife/.gemini/antigravity/brain/af2ac9c5-3336-4351-8fdd-f6ec4c654133/verify_projects_top.png",
  });

  // Scroll down to see Spotify and Sorting cards
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(600);
  await page.screenshot({
    path: "C:/Users/ruife/.gemini/antigravity/brain/af2ac9c5-3336-4351-8fdd-f6ec4c654133/verify_projects_middle.png",
  });

  // 3. Check FormFixer Deep Dive
  console.log("3. Visiting FormFixer Page...");
  await page.goto("http://localhost:4173/projects/form-fixer", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: "C:/Users/ruife/.gemini/antigravity/brain/af2ac9c5-3336-4351-8fdd-f6ec4c654133/verify_formfixer_top.png",
  });

  // Scroll down on FormFixer to see Image Showcase Gallery
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(600);
  await page.screenshot({
    path: "C:/Users/ruife/.gemini/antigravity/brain/af2ac9c5-3336-4351-8fdd-f6ec4c654133/verify_formfixer_gallery.png",
  });

  // 4. Check Hobbies Page
  console.log("4. Visiting Hobbies Page...");
  await page.goto("http://localhost:4173/hobbies", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "C:/Users/ruife/.gemini/antigravity/brain/af2ac9c5-3336-4351-8fdd-f6ec4c654133/verify_hobbies.png",
  });

  console.log("All screenshots captured successfully!");
  await browser.close();
  server.kill();
}

main().catch((err) => {
  console.error("Playwright error:", err);
  process.exit(1);
});

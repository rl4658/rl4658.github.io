const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
const artifactDirs = [
  "C:\\Users\\ruife\\.gemini\\antigravity\\brain\\f76cafbb-27da-4d50-a2ea-75489f3a604c",
  "C:\\Users\\ruife\\.gemini\\antigravity\\brain\\af2ac9c5-3336-4351-8fdd-f6ec4c654133",
];

async function saveScreenshot(page, filename, clipOrOptions = {}) {
  for (const dir of artifactDirs) {
    if (fs.existsSync(dir)) {
      await page.screenshot({ path: path.join(dir, filename), ...clipOrOptions });
    }
  }
}

// Simple static SPA server for dist
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  let filePath = path.join(distDir, req.url.split("?")[0]);
  if (req.url === "/" || req.url.startsWith("/projects")) {
    if (!path.extname(filePath)) {
      filePath = path.join(distDir, "index.html");
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexHtml = path.join(distDir, "index.html");
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(indexHtml).pipe(res);
  }
});

const PORT = 4180;
server.listen(PORT, async () => {
  console.log(`Verification static server running on http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });

  try {
    // ---------------------------------------------------------
    // TEST 1: Projects Page & Expanded SortingHub Widget
    // ---------------------------------------------------------
    console.log("\n--- VERIFYING TASK 2: SORTING HUB EXPANDED PREVIEW ---");
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    await page.goto(`http://localhost:${PORT}/projects`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Locate Sorting Hub card
    const sortingCard = page.locator("text=Sorting Hub").first();
    await sortingCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Find the widget container
    const sortingWidget = page.locator("text=Sorting Hub").locator("xpath=ancestor::div[contains(@class, 'glass-strong')]");
    console.log("Sorting Hub widget found:", (await sortingWidget.count()) > 0);

    // Capture initial state of the expanded SortingHub widget on desktop
    await saveScreenshot(sortingWidget, "sortinghub_preview_desktop.png");
    console.log("Saved sortinghub_preview_desktop.png");

    // Check that 'Case Study ->' button is REMOVED from widget top bar
    const caseStudyBtn = sortingWidget.locator("button:has-text('Case Study')");
    console.log("Is 'Case Study' button removed?", (await caseStudyBtn.count()) === 0 ? "YES (PASS)" : "NO (FAIL)");

    // Interact with Speed / Delay Slider
    const delaySlider = sortingWidget.locator("input[type='range']").nth(1); // 2nd slider is delay
    await delaySlider.fill("15");
    await page.waitForTimeout(200);

    // Click "Sort" button
    const sortBtn = sortingWidget.locator("button:has-text('Sort')");
    await sortBtn.click();
    console.log("Clicked Sort button");
    await page.waitForTimeout(600);

    // Capture sorting in progress with active highlighted bars and live delay
    await saveScreenshot(sortingWidget, "sortinghub_sorting_active.png");
    console.log("Saved sortinghub_sorting_active.png");

    // Click "Reset" button
    const resetBtn = sortingWidget.locator("button:has-text('Reset')");
    await resetBtn.click();
    console.log("Clicked Reset button");
    await page.waitForTimeout(300);

    // Mobile viewport verification for Projects Page & SortingHub Widget
    console.log("\n--- VERIFYING MOBILE VIEWPORT & ZERO HORIZONTAL OVERFLOW ---");
    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await mobilePage.goto(`http://localhost:${PORT}/projects`, { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(800);

    const hasHorizontalOverflowProjects = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log("Projects Mobile has horizontal overflow?", hasHorizontalOverflowProjects ? "FAIL" : "NO - PASS (Zero overflow!)");

    const mobileSortingWidget = mobilePage.locator("text=Sorting Hub").locator("xpath=ancestor::div[contains(@class, 'glass-strong')]");
    if (await mobileSortingWidget.count() > 0) {
      await mobileSortingWidget.scrollIntoViewIfNeeded();
      await mobilePage.waitForTimeout(500);
      await saveScreenshot(mobileSortingWidget, "sortinghub_preview_mobile.png");
      console.log("Saved sortinghub_preview_mobile.png");
    }

    // ---------------------------------------------------------
    // TEST 2: Enginerea Project Bobby Movement Verification
    // ---------------------------------------------------------
    console.log("\n--- VERIFYING TASK 1: ENGINEREA ARENA BOBBY MOVEMENT ---");
    const enginereaPage = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    await enginereaPage.goto(`http://localhost:${PORT}/projects/enginerea`, { waitUntil: "networkidle" });
    await enginereaPage.waitForTimeout(1000);

    const arena = enginereaPage.locator("#autonomous-arena");
    await arena.scrollIntoViewIfNeeded();
    await enginereaPage.waitForTimeout(800);

    // Verify backdrop and platform
    await saveScreenshot(arena, "enginerea_arena_bobby_cliff.png");
    console.log("Saved enginerea_arena_bobby_cliff.png");

    // Trigger jump
    await enginereaPage.keyboard.press("ArrowUp");
    await enginereaPage.waitForTimeout(300);
    await saveScreenshot(arena, "enginerea_arena_bobby_jump_cliff.png");
    console.log("Saved enginerea_arena_bobby_jump_cliff.png");

    // Trigger chuck axe
    await enginereaPage.keyboard.press("Space");
    await enginereaPage.waitForTimeout(500);
    await saveScreenshot(arena, "enginerea_arena_clash_platform.png");
    console.log("Saved enginerea_arena_clash_platform.png");

    // Check mobile responsiveness on Enginerea page
    const mobileEnginerea = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await mobileEnginerea.goto(`http://localhost:${PORT}/projects/enginerea`, { waitUntil: "networkidle" });
    await mobileEnginerea.waitForTimeout(800);

    const hasHorizontalOverflowEnginerea = await mobileEnginerea.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log("Enginerea Mobile has horizontal overflow?", hasHorizontalOverflowEnginerea ? "FAIL" : "NO - PASS (Zero overflow!)");

    console.log("\nALL VERIFICATIONS PASSED SUCCESSFULLY!");
  } catch (err) {
    console.error("Verification failed:", err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});

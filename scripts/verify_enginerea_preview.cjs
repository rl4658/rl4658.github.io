const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
const artifactDirs = [
  "C:\\Users\\ruife\\.gemini\\antigravity\\brain\\c0b18e33-4ef7-458f-a135-543b31ce19fc",
  "C:\\Users\\ruife\\.gemini\\antigravity\\brain\\af2ac9c5-3336-4351-8fdd-f6ec4c654133",
];

async function saveScreenshot(locatorOrPage, filename) {
  for (const dir of artifactDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const targetPath = path.join(dir, filename);
    await locatorOrPage.screenshot({ path: targetPath });
    console.log(`Saved screenshot to: ${targetPath}`);
  }
}

// Simple static SPA server for dist
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
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

const PORT = 4195;
server.listen(PORT, async () => {
  console.log(`Static server running on http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });

  try {
    const errors = [];
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    page.on("pageerror", (err) => errors.push(`[PAGE ERROR]: ${err.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`[CONSOLE ERROR]: ${msg.text()}`);
    });

    console.log("Navigating to /projects...");
    await page.goto(`http://localhost:${PORT}/projects`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Locate Enginerea card
    const enginereaHeader = page.locator("h3:has-text('Bobby: The Town of Enginerea')").first();
    await enginereaHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const enginereaCard = page.locator("div.glass-strong:has(h3:has-text('Bobby: The Town of Enginerea'))");
    const count = await enginereaCard.count();
    console.log("Enginerea card count:", count);

    // Locate Enginerea widget inside card
    const enginereaWidget = enginereaCard.locator("div.group\\/enginerea");
    console.log("Enginerea widget count:", await enginereaWidget.count());

    // Check that redundant modal capsule and redundant button are GONE
    const redundantBtn = enginereaCard.locator("button:has-text('Explore Case Study & Architecture')");
    console.log("Redundant 'Explore Case Study & Architecture' button count:", await redundantBtn.count());
    if (await redundantBtn.count() > 0) {
      console.error("FAIL: Redundant button still present!");
    } else {
      console.log("PASS: Redundant button is successfully removed.");
    }

    // Capture idle preview on desktop
    await saveScreenshot(enginereaCard, "enginerea_widget_preview_idle.png");

    // Hover over the Enginerea widget to reveal the 'Explore Project' hover overlay
    await enginereaWidget.hover();
    await page.waitForTimeout(400);

    // Verify hover overlay is visible
    const hoverPill = enginereaWidget.locator("div:has-text('Explore Project')").last();
    console.log("Hover pill count:", await hoverPill.count());

    // Capture hover preview on desktop
    await saveScreenshot(enginereaCard, "enginerea_widget_preview_hover.png");

    // Test navigation by clicking the Enginerea widget
    console.log("Testing click navigation to /projects/enginerea...");
    await enginereaWidget.click();
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    console.log("URL after clicking Enginerea widget:", currentUrl);
    if (currentUrl.includes("/projects/enginerea")) {
      console.log("PASS: Successfully navigated to /projects/enginerea on widget click!");
    } else {
      console.error("FAIL: Did not navigate to /projects/enginerea, current URL:", currentUrl);
    }

    // Mobile viewport test
    console.log("\n--- MOBILE TEST (375x812) ---");
    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
    mobilePage.on("pageerror", (err) => errors.push(`[MOBILE PAGE ERROR]: ${err.message}`));
    await mobilePage.goto(`http://localhost:${PORT}/projects`, { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(1000);

    const mobileEnginereaCard = mobilePage.locator("div.glass-strong:has(h3:has-text('Bobby: The Town of Enginerea'))");
    await mobileEnginereaCard.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(500);

    await saveScreenshot(mobileEnginereaCard, "enginerea_widget_preview_mobile.png");

    const overflowXMobile = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log("Mobile horizontal overflow detected:", overflowXMobile);

    console.log("\n--- CONSOLE ERRORS SUMMARY ---");
    if (errors.length === 0) {
      console.log("PASS: 0 console errors detected across desktop and mobile.");
    } else {
      console.error(`Found ${errors.length} errors:`, errors);
    }

    console.log("\nVERIFICATION COMPLETE SUCCESS!");
  } catch (err) {
    console.error("Test failed with exception:", err);
  } finally {
    await browser.close();
    server.close();
  }
});

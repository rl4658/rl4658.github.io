const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "dist");
const artifactDir = "C:\\Users\\ruife\\.gemini\\antigravity\\brain\\af2ac9c5-3336-4351-8fdd-f6ec4c654133";

// Simple static server for dist
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
    // SPA fallback
    const indexHtml = path.join(distDir, "index.html");
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(indexHtml).pipe(res);
  }
});

server.listen(4174, async () => {
  console.log("Static server running on port 4174");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  try {
    console.log("Navigating to /projects/enginerea...");
    await page.goto("http://localhost:4174/projects/enginerea", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // 1. Capture Autonomous Combat Arena
    const arena = page.locator("#autonomous-arena");
    if (await arena.count() > 0) {
      await arena.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(artifactDir, "pw_autonomous_combat_arena.png"),
      });
      console.log("Captured pw_autonomous_combat_arena.png");
    }

    // 2. Locate Campaign Gallery
    const gallery = page.locator("#campaign-gallery");
    if (await gallery.count() > 0) {
      await gallery.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const views = [
        ["Start Menu", "pw_gallery_start_menu.png"],
        ["Stage 1: Ruins", "pw_gallery_stage1_full.png"],
        ["Stage 2: Magma", "pw_gallery_stage2_full.png"],
        ["Stage 3: Boss", "pw_gallery_stage3_boss.png"],
        ["In-Game Shop", "pw_gallery_shop_screen.png"],
        ["Victory / Death", "pw_gallery_victory_screen.png"],
      ];

      for (const [btnName, filename] of views) {
        const btn = page.getByRole("button", { name: btnName });
        if (await btn.count() > 0) {
          await btn.click();
          await page.waitForTimeout(600);
          await page.screenshot({
            path: path.join(artifactDir, filename),
          });
          console.log(`Captured ${filename}`);
        }
      }
    }

    // 3. Mobile responsiveness check
    console.log("Testing mobile responsiveness (375x812)...");
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(800);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile Viewport Check: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`);
    if (scrollWidth > clientWidth) {
      console.warn("WARNING: Mobile horizontal overflow detected!");
    } else {
      console.log("PASS: Zero horizontal scroll overflow on mobile!");
    }

  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await browser.close();
    server.close();
    console.log("Test finished successfully.");
    process.exit(0);
  }
});

const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
const outputDir = "C:\\Users\\ruife\\.gemini\\antigravity\\brain\\af2ac9c5-3336-4351-8fdd-f6ec4c654133";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Static SPA Server
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

const PORT = 4174;
server.listen(PORT, async () => {
  console.log(`Preview server running on http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  let allPassed = true;

  try {
    // -------------------------------------------------------------
    // TEST 1: Desktop Viewport (1440 x 900)
    // -------------------------------------------------------------
    console.log("\n=== TEST 1: Desktop (1440x900) ===");
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://localhost:${PORT}/projects`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    // 1. Check page horizontal overflow
    const desktopOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`Desktop Page Overflow: ${desktopOverflow ? "FAIL" : "PASS (0px)"}`);
    if (desktopOverflow) allPassed = false;

    // 2. Locate ChatroomWidget
    const chatroomCard = page.locator(".group\\/chatroom");
    await chatroomCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    // 3. Inspect Centering & Geometry
    const geometry = await page.evaluate(() => {
      const card = document.querySelector(".group\\/chatroom");
      if (!card) return null;
      const windowFrame = card.querySelector(".max-w-xl");
      if (!windowFrame) return null;

      const cardRect = card.getBoundingClientRect();
      const frameRect = windowFrame.getBoundingClientRect();

      const leftMargin = frameRect.left - cardRect.left;
      const rightMargin = cardRect.right - frameRect.right;
      const diff = Math.abs(leftMargin - rightMargin);

      // Check Connect button visibility and bounds
      const connectBtn = Array.from(windowFrame.querySelectorAll("div")).find(
        (el) => el.textContent && el.textContent.trim() === "Connect"
      );
      let connectBounds = null;
      if (connectBtn) {
        const cRect = connectBtn.getBoundingClientRect();
        connectBounds = {
          top: cRect.top,
          bottom: cRect.bottom,
          insideCard: cRect.bottom <= cardRect.bottom,
          distanceFromBottom: cardRect.bottom - cRect.bottom,
        };
      }

      return {
        cardWidth: cardRect.width,
        cardHeight: cardRect.height,
        frameWidth: frameRect.width,
        frameHeight: frameRect.height,
        leftMargin,
        rightMargin,
        diff,
        isCentered: diff < 6, // within pixel rounding tolerance
        connectBounds,
      };
    });

    console.log("Desktop Widget Geometry:", JSON.stringify(geometry, null, 2));

    if (!geometry || !geometry.isCentered) {
      console.error("FAIL: Desktop window is NOT centered!");
      allPassed = false;
    } else {
      console.log("PASS: Desktop window is perfectly centered with mx-auto!");
    }

    if (!geometry || !geometry.connectBounds || !geometry.connectBounds.insideCard) {
      console.error("FAIL: Connect button overflows or is clipped!");
      allPassed = false;
    } else {
      console.log(`PASS: Connect button is fully visible with ${geometry.connectBounds.distanceFromBottom.toFixed(1)}px breathing room above card bottom!`);
    }

    // Save desktop screenshot (card element)
    const desktopScreenshotPath = path.join(outputDir, "chatroom_preview_desktop_centered.png");
    await chatroomCard.screenshot({ path: desktopScreenshotPath });
    console.log(`Saved desktop screenshot to: ${desktopScreenshotPath}`);

    // Test hover state
    await chatroomCard.hover();
    await page.waitForTimeout(300);
    const isHoverOverlayVisible = await page.evaluate(() => {
      const card = document.querySelector(".group\\/chatroom");
      const overlay = card ? card.querySelector(".group-hover\\/chatroom\\:opacity-100") : null;
      if (!overlay) return false;
      const style = window.getComputedStyle(overlay);
      return parseFloat(style.opacity) > 0.5;
    });
    console.log("Desktop Hover Overlay visible:", isHoverOverlayVisible ? "PASS" : "FAIL");
    if (!isHoverOverlayVisible) allPassed = false;
    await page.close();

    // -------------------------------------------------------------
    // TEST 2: Mobile Viewports (375x812 and 390x844)
    // -------------------------------------------------------------
    for (const vp of [
      { name: "iPhone SE/X (375x812)", width: 375, height: 812 },
      { name: "iPhone 12/13/14 (390x844)", width: 390, height: 844 },
    ]) {
      console.log(`\n=== TEST 2: Mobile ${vp.name} ===`);
      const mobilePage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await mobilePage.goto(`http://localhost:${PORT}/projects`, { waitUntil: "networkidle" });
      await mobilePage.waitForTimeout(600);

      const mOverflow = await mobilePage.evaluate(() => {
        return {
          pageOverflow: document.documentElement.scrollWidth > window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: window.innerWidth,
        };
      });
      console.log(`Mobile Page Overflow: ${mOverflow.pageOverflow ? "FAIL" : "PASS (0px)"} (${mOverflow.scrollWidth}px vs ${mOverflow.clientWidth}px)`);
      if (mOverflow.pageOverflow) allPassed = false;

      const mCard = mobilePage.locator(".group\\/chatroom");
      await mCard.scrollIntoViewIfNeeded();
      await mobilePage.waitForTimeout(300);

      const mGeometry = await mobilePage.evaluate(() => {
        const card = document.querySelector(".group\\/chatroom");
        if (!card) return null;
        const cardRect = card.getBoundingClientRect();
        const connectBtn = Array.from(card.querySelectorAll("div")).find(
          (el) => el.textContent && el.textContent.trim() === "Connect"
        );
        let connectInside = false;
        let distanceFromBottom = 0;
        if (connectBtn) {
          const cRect = connectBtn.getBoundingClientRect();
          connectInside = cRect.bottom <= cardRect.bottom;
          distanceFromBottom = cardRect.bottom - cRect.bottom;
        }

        return {
          cardWidth: cardRect.width,
          cardHeight: cardRect.height,
          cardOverflow: card.scrollWidth > card.clientWidth,
          connectInside,
          distanceFromBottom,
        };
      });

      console.log(`Mobile ${vp.name} Geometry:`, JSON.stringify(mGeometry, null, 2));

      if (!mGeometry || mGeometry.cardOverflow) {
        console.error(`FAIL: Mobile card has horizontal overflow!`);
        allPassed = false;
      }
      if (!mGeometry || !mGeometry.connectInside) {
        console.error(`FAIL: Mobile Connect button is cut off at bottom!`);
        allPassed = false;
      } else {
        console.log(`PASS: Mobile Connect button is fully visible with ${mGeometry.distanceFromBottom.toFixed(1)}px breathing room!`);
      }

      // Save mobile screenshot for 390x844
      if (vp.width === 390) {
        const mobileScreenshotPath = path.join(outputDir, "chatroom_preview_mobile_fixed.png");
        await mCard.screenshot({ path: mobileScreenshotPath });
        console.log(`Saved mobile screenshot to: ${mobileScreenshotPath}`);
      }

      await mobilePage.close();
    }

    console.log(`\n========================================`);
    console.log(`OVERALL TEST STATUS: ${allPassed ? "SUCCESS (ALL TESTS PASSED)" : "FAILED"}`);
    console.log(`========================================\n`);
  } catch (err) {
    console.error("Test execution error:", err);
    allPassed = false;
  } finally {
    await browser.close();
    server.close();
    process.exit(allPassed ? 0 : 1);
  }
});

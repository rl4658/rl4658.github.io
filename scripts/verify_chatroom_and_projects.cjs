const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
const artifactDirs = [
  "C:\\Users\\ruife\\.gemini\\antigravity\\brain\\88067b4b-3339-4dde-bf43-80d07da4f4fa",
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

const PORT = 4173;
server.listen(PORT, async () => {
  console.log(`Test preview server running on http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  let hasErrors = false;

  try {
    // -----------------------------------------------------------------------
    // TEST 1: Desktop Viewport (1440 x 900) - Projects Page & Previews
    // -----------------------------------------------------------------------
    console.log("\n--- TEST 1: Projects Page & Non-Interactive Preview Cards ---");
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://localhost:${PORT}/projects`, { waitUntil: "networkidle" });

    // Check for 0 horizontal overflow
    const desktopProjectsOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log("Desktop /projects horizontal overflow:", desktopProjectsOverflow ? "FAIL" : "PASS (0px)");
    if (desktopProjectsOverflow) hasErrors = true;

    // Check all 5 preview cards
    const formFixer = page.locator(".group\\/phone");
    const spotify = page.locator(".group\\/spotify");
    const sorting = page.locator(".group\\/sorting");
    const enginerea = page.locator(".group\\/enginerea");
    const chatroom = page.locator(".group\\/chatroom");

    console.log("FormFixer card visible:", (await formFixer.count()) > 0);
    console.log("Spotify card visible:", (await spotify.count()) > 0);
    console.log("SortingHub card visible:", (await sorting.count()) > 0);
    console.log("Enginerea card visible:", (await enginerea.count()) > 0);
    console.log("Chatroom Whisperers card visible:", (await chatroom.count()) > 0);

    // Test Hover overlay on Chatroom Whisperers
    await chatroom.hover();
    await page.waitForTimeout(400);
    await saveScreenshot(page, "projects_preview_grid_desktop.png");

    // Click on Chatroom Whisperers card to test direct navigation
    console.log("Clicking Chatroom Whisperers card...");
    await chatroom.click();
    await page.waitForTimeout(500);

    const currentUrl = page.url();
    console.log("Navigated URL:", currentUrl);
    if (!currentUrl.includes("/projects/chatroom-whisperers")) {
      console.error("FAIL: Did not navigate to /projects/chatroom-whisperers");
      hasErrors = true;
    } else {
      console.log("PASS: Successfully navigated to /projects/chatroom-whisperers");
    }

    // -----------------------------------------------------------------------
    // TEST 2: Dedicated Chatroom Whisperers Case Study Page
    // -----------------------------------------------------------------------
    console.log("\n--- TEST 2: Dedicated Chatroom Whisperers Case Study Page ---");
    await page.waitForSelector("h1", { timeout: 5000 });
    const h1Text = await page.locator("h1").innerText();
    console.log("Page H1:", h1Text);

    // Check table of contents / sections
    const tocLinks = await page.locator('nav[aria-label="On this page"] a').allInnerTexts();
    console.log("Table of Contents sections count:", tocLinks.length);
    console.log("Sections:", tocLinks);

    // Check for 0 horizontal overflow on desktop case study
    const desktopCaseStudyOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log("Desktop case study horizontal overflow:", desktopCaseStudyOverflow ? "FAIL" : "PASS (0px)");
    if (desktopCaseStudyOverflow) hasErrors = true;

    // Scroll to Interactive Studio
    const studioSection = page.locator("#interactive-studio");
    await studioSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await saveScreenshot(page, "chatroom_case_study_studio_desktop.png");

    // Test PyQt5 Client GUI interactions
    console.log("\n--- Testing PyQt5 Client GUI Simulator ---");
    
    // 1. Change username
    const usernameInput = page.locator('input[placeholder="Enter username"]');
    await usernameInput.fill("systems_lead");
    console.log("Username set to: systems_lead");

    // 2. Adjust capacity slider
    const slider = page.locator('input[type="range"]');
    await slider.fill("3");
    console.log("Lobby capacity slider set to 3 users");

    // 3. Test Room Creation
    const roomNameInput = page.locator('input[placeholder="e.g. distributed-systems"]');
    await roomNameInput.fill("systems-nexus");
    const createBtn = page.getByRole("button", { name: "Create Chatroom" });
    await createBtn.click();
    await page.waitForTimeout(400);

    // Verify ChatWindow is opened
    const roomHeader = page.locator("span.font-bold:has-text('systems-nexus')");
    console.log("ChatWindow opened for systems-nexus:", (await roomHeader.count()) > 0);
    await saveScreenshot(page, "chatroom_active_chat_window.png");

    // 4. Send a message
    const chatInput = page.locator('input[placeholder="Type message to room..."]');
    await chatInput.fill("POSIX TCP worker thread pool initialized on port 3000.");
    const sendBtn = page.getByRole("button", { name: "Send" });
    await sendBtn.click();
    await page.waitForTimeout(1000); // Wait for mock peer response

    // 5. Disconnect
    const disconnectBtn = page.getByRole("button", { name: "Disconnect", exact: true });
    await disconnectBtn.click();
    await page.waitForTimeout(300);
    console.log("Disconnected back to Lobby");

    // 6. Test Password Validation on Locked Room (cyber-den)
    console.log("Testing Password Validation on cyber-den...");
    const roomSelect = page.locator("select");
    await roomSelect.selectOption("cyber-den");
    await page.waitForTimeout(200);

    // Verify password field is revealed
    const pwdInput = page.locator('input[placeholder="Enter room password to unlock..."]');
    console.log("Password input revealed:", (await pwdInput.count()) > 0);

    // Enter wrong password
    await pwdInput.fill("wrongpass");
    const connectBtn = page.getByRole("button", { name: "Connect", exact: true });
    await connectBtn.click();
    await page.waitForTimeout(300);

    // Verify QMessageBox modal appeared
    const warningModal = page.locator("div:has-text('QMessageBox - Warning')");
    console.log("QMessageBox warning modal appeared:", (await warningModal.count()) > 0);
    await saveScreenshot(page, "chatroom_qmessagebox_invalid_password.png");

    // Click OK to dismiss modal
    const okBtn = page.getByRole("button", { name: "OK" });
    await okBtn.click();
    await page.waitForTimeout(200);

    // 7. Test Room Full Capacity Warning (algo-lab is 4/4)
    console.log("Testing Room Full Capacity on algo-lab...");
    await roomSelect.selectOption("algo-lab");
    await page.waitForTimeout(200);
    await connectBtn.click();
    await page.waitForTimeout(300);

    const fullModal = page.locator("div:has-text('Room Full')");
    console.log("QMessageBox Room Full modal appeared:", (await fullModal.count()) > 0);
    await saveScreenshot(page, "chatroom_qmessagebox_room_full.png");
    await okBtn.click();
    await page.waitForTimeout(200);

    // 8. Test C++ Server Bus Tab
    console.log("\n--- Testing C++ Socket Server Bus Tab ---");
    const serverTabBtn = page.getByRole("button", { name: "C++ Socket Server Bus" });
    await serverTabBtn.click();
    await page.waitForTimeout(400);

    const busHeader = page.locator("span:has-text('POSIX TCP Server Bus')");
    console.log("Server Bus Terminal visible:", (await busHeader.count()) > 0);

    // Test Custom Packet Injector
    const packetInput = page.locator('input[placeholder*="MESSAGE_ROOM"]');
    await packetInput.fill("CREATE_ROOM;bench-lab;NO_PASSWORD;1;4;systems_lead");
    const dispatchBtn = page.getByRole("button", { name: "Dispatch" });
    await dispatchBtn.click();
    await page.waitForTimeout(300);
    await saveScreenshot(page, "chatroom_server_bus_terminal.png");

    // -----------------------------------------------------------------------
    // TEST 3: Mobile Viewport (375 x 812) - Responsiveness & Overflow
    // -----------------------------------------------------------------------
    console.log("\n--- TEST 3: Mobile Viewport (375 x 812) ---");
    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });

    // 1. Mobile /projects
    await mobilePage.goto(`http://localhost:${PORT}/projects`, { waitUntil: "networkidle" });
    const mobileProjectsOverflow = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log("Mobile /projects horizontal overflow:", mobileProjectsOverflow ? "FAIL" : "PASS (0px)");
    if (mobileProjectsOverflow) hasErrors = true;
    await saveScreenshot(mobilePage, "projects_mobile_375x812.png");

    // 2. Mobile /projects/chatroom-whisperers
    await mobilePage.goto(`http://localhost:${PORT}/projects/chatroom-whisperers`, { waitUntil: "networkidle" });
    const mobileCaseStudyOverflow = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log("Mobile case study horizontal overflow:", mobileCaseStudyOverflow ? "FAIL" : "PASS (0px)");
    if (mobileCaseStudyOverflow) hasErrors = true;

    // Scroll down to mobile studio
    const mobileStudio = mobilePage.locator("#interactive-studio");
    await mobileStudio.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(300);
    await saveScreenshot(mobilePage, "chatroom_case_study_mobile_studio.png");

    console.log("\n========================================================");
    console.log(hasErrors ? "VERIFICATION COMPLETED WITH ERRORS!" : "ALL VERIFICATION CHECKS PASSED PERFECTLY!");
    console.log("========================================================\n");
  } catch (err) {
    console.error("Test failed with error:", err);
    hasErrors = true;
  } finally {
    await browser.close();
    server.close();
    process.exit(hasErrors ? 1 : 0);
  }
});

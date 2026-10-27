import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function waitForServer(url, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200 || res.status === 304) return true;
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Timeout waiting for ${url}`);
}

async function main() {
  const screenshotDir = path.resolve('public/screenshots');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  console.log('Starting preview server on port 4174...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4174', '--host', '127.0.0.1'], {
    shell: true,
    stdio: 'pipe'
  });

  server.stdout.on('data', (d) => console.log(`[Preview Server] ${d}`));
  server.stderr.on('data', (d) => console.error(`[Preview Server Err] ${d}`));

  try {
    await waitForServer('http://127.0.0.1:4174');
    console.log('Preview server is alive! Launching browser...');

    const browser = await chromium.launch({ headless: true });

    // Desktop verification: 1440 x 900
    console.log('Verifying Desktop 1440x900...');
    const desktopPage = await browser.newPage({
      viewport: { width: 1440, height: 900 }
    });
    await desktopPage.addInitScript(() => {
      localStorage.setItem('portfolio-intro-seen-v1', '1');
    });

    const consoleErrors = [];
    desktopPage.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await desktopPage.goto('http://127.0.0.1:4174/', { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(1500);

    // Scroll to #publication
    const pubSection = desktopPage.locator('#publication');
    await pubSection.scrollIntoViewIfNeeded();
    await desktopPage.waitForTimeout(1000);

    // Take screenshot of section
    const desktopSecPath = path.join(screenshotDir, 'publication_section_desktop.png');
    await pubSection.screenshot({ path: desktopSecPath });
    console.log('Saved desktop section screenshot:', desktopSecPath);

    // Also take viewport screenshot
    const desktopViewPath = path.join(screenshotDir, 'publication_viewport_desktop.png');
    await desktopPage.screenshot({ path: desktopViewPath });

    // Check horizontal overflow on desktop
    const desktopOverflow = await desktopPage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log('Desktop horizontal overflow:', desktopOverflow);

    // Mobile verification: 375 x 812
    console.log('Verifying Mobile 375x812...');
    const mobilePage = await browser.newPage({
      viewport: { width: 375, height: 812 }
    });
    await mobilePage.addInitScript(() => {
      localStorage.setItem('portfolio-intro-seen-v1', '1');
    });

    mobilePage.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await mobilePage.goto('http://127.0.0.1:4174/', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1500);

    const mobilePub = mobilePage.locator('#publication');
    await mobilePub.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(1000);

    const mobileSecPath = path.join(screenshotDir, 'publication_section_mobile.png');
    await mobilePub.screenshot({ path: mobileSecPath });
    console.log('Saved mobile section screenshot:', mobileSecPath);

    // Check horizontal overflow on mobile
    const mobileOverflow = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log('Mobile horizontal overflow:', mobileOverflow);

    await browser.close();
    console.log('Verification completed successfully! Console errors:', consoleErrors.length);
  } finally {
    try {
      if (server.pid) {
        spawn('taskkill', ['/F', '/PID', server.pid.toString(), '/T'], { shell: true });
      }
    } catch (e) {}
  }
}

main().catch((err) => {
  console.error('Error running verification:', err);
  process.exit(1);
});

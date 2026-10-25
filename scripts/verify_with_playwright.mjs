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

  console.log('Starting preview server on port 4173...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4173', '--host', '127.0.0.1'], {
    shell: true,
    stdio: 'pipe'
  });

  server.stdout.on('data', (d) => console.log(`[Preview Server] ${d}`));
  server.stderr.on('data', (d) => console.error(`[Preview Server Err] ${d}`));

  try {
    await waitForServer('http://127.0.0.1:4173');
    console.log('Preview server is alive! Launching Playwright browser control...');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 }
    });

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // 1. Check Homepage
    console.log('1. Checking Homepage / ...');
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotDir, '1_homepage_monochrome.png') });

    // 2. Check Projects Page
    console.log('2. Checking /projects ...');
    await page.goto('http://127.0.0.1:4173/projects', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotDir, '2_projects_monochrome.png') });

    // Verify no descriptions on the bottom of FormFixer widget
    const formFixerCard = await page.$('text=FormFixer.AI');
    console.log('FormFixer Card found:', !!formFixerCard);

    // 3. Click into FormFixer or navigate to /projects/form-fixer
    console.log('3. Checking /projects/form-fixer dedicated page...');
    await page.goto('http://127.0.0.1:4173/projects/form-fixer', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotDir, '3_formfixer_case_study_top.png') });

    // Scroll down to check architecture and kinematics
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, '4_formfixer_kinematics.png') });

    // Scroll down to check exercises
    await page.evaluate(() => window.scrollBy(0, 900));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, '5_formfixer_exercises.png') });

    await browser.close();
    console.log('Playwright browser checks completed! Console errors count:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
  } finally {
    try {
      if (server.pid) {
        spawn('taskkill', ['/F', '/PID', server.pid.toString(), '/T'], { shell: true });
      }
    } catch (e) {}
  }
}

main().catch((err) => {
  console.error('Error running Playwright browser control verification:', err);
  process.exit(1);
});

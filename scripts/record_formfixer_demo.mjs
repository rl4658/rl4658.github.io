import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function main() {
  const outputDir = path.resolve('public/videos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();
  console.log('Navigating to FormFixer video at live app walkthrough timestamp...');
  // Start right before the exercise tracking demo at 24:05 (1445s)
  await page.goto('https://www.youtube.com/watch?v=JZ4HPtc7ChY&t=1445s');
  await page.waitForTimeout(4000);

  // Click play button if present
  try {
    await page.click('button.ytp-large-play-button', { timeout: 2000 });
  } catch(e) {}

  // Clean up UI and expand video to fill viewport
  await page.evaluate(() => {
    // Hide YouTube header, sidebar, comments
    const toHide = ['#masthead-container', '#secondary', '#comments', '#below', '.ytp-chrome-top'];
    toHide.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.style.display = 'none';
    });

    // Make player full page
    const player = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
    if (player) {
      player.style.position = 'fixed';
      player.style.top = '0';
      player.style.left = '0';
      player.style.width = '100vw';
      player.style.height = '100vh';
      player.style.zIndex = '999999';
    }

    const video = document.querySelector('video');
    if (video) {
      video.muted = true;
      video.play();
    }
  });

  console.log('Recording 16 seconds of real product walkthrough...');
  await page.waitForTimeout(16000);

  // Capture a crisp poster screenshot for video placeholder
  await page.screenshot({ path: path.join(outputDir, 'formfixer_poster.jpg'), quality: 90, type: 'jpeg' });
  console.log('Captured poster frame');

  await page.close();
  await context.close();
  await browser.close();

  // Find the generated webm file in outputDir and rename it to formfixer_demo.webm
  const files = fs.readdirSync(outputDir);
  const videoFiles = files.filter(f => f.endsWith('.webm') && f.startsWith('page@'));
  if (videoFiles.length > 0) {
    // Sort by mtime descending
    videoFiles.sort((a, b) => {
      return fs.statSync(path.join(outputDir, b)).mtimeMs - fs.statSync(path.join(outputDir, a)).mtimeMs;
    });
    const latest = videoFiles[0];
    const target = path.join(outputDir, 'formfixer_demo.webm');
    if (fs.existsSync(target)) fs.unlinkSync(target);
    fs.renameSync(path.join(outputDir, latest), target);
    console.log(`Successfully saved video to ${target} (${(fs.statSync(target).size / 1024).toFixed(1)} KB)`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

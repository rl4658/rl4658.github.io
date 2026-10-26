const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  console.log('Opening YouTube at 1445s in 1080p...');
  await page.goto('https://www.youtube.com/watch?v=JZ4HPtc7ChY&t=1445s');
  await page.waitForTimeout(4000);

  // Force hd1080
  await page.evaluate(() => {
    const player = document.querySelector('#movie_player');
    if (player && player.setPlaybackQualityRange) {
      player.setPlaybackQualityRange('hd1080', 'hd1080');
      player.setPlaybackQuality('hd1080');
    }
    const video = document.querySelector('video');
    if (video) {
      video.muted = true;
      video.currentTime = 1446;
      video.play();
    }
  });

  // Wait until video is playing at 1080p
  for (let i = 0; i < 10; i++) {
    const status = await page.evaluate(() => {
      const v = document.querySelector('video');
      const p = document.querySelector('#movie_player');
      return {
        time: v ? v.currentTime : 0,
        w: v ? v.videoWidth : 0,
        h: v ? v.videoHeight : 0,
        q: p && p.getPlaybackQuality ? p.getPlaybackQuality() : 'unknown'
      };
    });
    console.log(`Check ${i}: ${status.w}x${status.h}, quality: ${status.q}, time: ${status.time}`);
    if (status.h === 1080 && status.time >= 1446) break;
    await page.waitForTimeout(1000);
  }

  // Grab frames from 1446.5 to 1453.5 every 0.15s (~6.7 fps or 0.1s for 10 fps)
  const framesDir = path.resolve('scripts/rep_frames');
  if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  const fps = 10; // 10 fps gives smooth motion and manageable frame count
  const startTime = 1447.0;
  const endTime = 1453.0; // 6 seconds = 60 frames
  const frameCount = Math.round((endTime - startTime) * fps);

  console.log(`Grabbing ${frameCount} frames from ${startTime}s to ${endTime}s at ${fps} fps...`);

  for (let i = 0; i < frameCount; i++) {
    const t = startTime + (i / fps);
    const dataUrl = await page.evaluate((targetTime) => {
      return new Promise((resolve) => {
        const video = document.querySelector('video');
        video.pause();
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          const canvas = document.createElement('canvas');
          // Exact phone bounds: x=716, y=0, w=548, h=1080
          canvas.width = 548;
          canvas.height = 1080;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 716, 0, 548, 1080, 0, 0, 548, 1080);
          resolve(canvas.toDataURL('image/jpeg', 0.96));
        };
        video.addEventListener('seeked', onSeeked, { once: true });
        video.currentTime = targetTime;
      });
    }, t);

    const b64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    const filename = `frame_${String(i).padStart(3, '0')}.jpg`;
    fs.writeFileSync(path.join(framesDir, filename), b64, 'base64');
    if (i % 10 === 0 || i === frameCount - 1) {
      console.log(`Saved frame ${i + 1}/${frameCount} (time ${t.toFixed(2)}s)`);
    }
  }

  await browser.close();
  console.log('Successfully captured all rep frames!');
})();

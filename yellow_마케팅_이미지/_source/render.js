const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const files = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  for (const f of files) {
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
    await page.goto('file://' + path.resolve(f));
    await page.evaluate(() => document.fonts.ready);
    const { w, h } = await page.evaluate(() => ({ w: +document.body.dataset.w, h: +document.body.dataset.h }));
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(250);
    const out = path.join(__dirname, 'out', path.basename(f).replace(/\.html$/, '.png'));
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: w, height: h } });
    console.log('rendered', out, w + 'x' + h);
    await page.close();
  }
  await browser.close();
})();

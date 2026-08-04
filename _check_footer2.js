const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(String(err)));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.locator('footer').screenshot({ path: 'C:/Users/Aekthana.b/AppData/Local/Temp/claude/c--Users-Aekthana-b-Desktop-Mathuros/9c3b6a8d-314b-48e5-a958-7220f1cccfcd/scratchpad/footer-new.png' });

  console.log('errors:', JSON.stringify(errors));
  await browser.close();
})();

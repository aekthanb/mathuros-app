const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1512, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.locator('.benefits').screenshot({ path: 'C:/Users/Aekthana.b/AppData/Local/Temp/claude/c--Users-Aekthana-b-Desktop-Mathuros/9c3b6a8d-314b-48e5-a958-7220f1cccfcd/scratchpad/current-benefits.png' });

  const styles = await page.locator('.benefits').evaluate((el) => {
    const cs = getComputedStyle(el);
    return { background: cs.backgroundColor, padding: cs.padding, gap: cs.gap, marginTop: cs.marginTop, border: cs.border };
  });
  console.log('benefits container styles:', JSON.stringify(styles));

  const articleStyles = await page.locator('.benefits article').first().evaluate((el) => {
    const cs = getComputedStyle(el);
    return { padding: cs.padding, background: cs.backgroundColor };
  });
  console.log('article styles:', JSON.stringify(articleStyles));

  await browser.close();
})();

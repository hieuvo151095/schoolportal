const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'https://app-dev.ecoschool.com.vn';
const SCHOOL_CODE = '7900004033';
const OUTPUT_DIR = path.resolve(__dirname, 'screenshots');
const DATA_DIR = path.resolve(__dirname, 'data');

const COOKIE_STRING = process.env.PORTAL_COOKIE || "";

function parseCookies(cookieStr, url) {
  return cookieStr.split(';').map(pair => {
    const trimmed = pair.trim();
    if (!trimmed) return null;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) return null;
    const name = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    const cookie = { name, value, url };
    if (name.startsWith('__Host-')) {
      cookie.secure = true;
      cookie.path = '/';
    } else if (name.startsWith('__Secure-')) {
      cookie.secure = true;
    }
    return cookie;
  }).filter(Boolean);
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });
  await page.setCookie(...parseCookies(COOKIE_STRING, BASE_URL));

  console.log('Navigating to /school/revenue-categories/...');
  await page.goto(`${BASE_URL}/${SCHOOL_CODE}/school/revenue-categories/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Remove announcement modal if any
  await page.evaluate(() => {
    const modals = document.querySelectorAll('.system-announcement-modal, [class*="announcement-modal"], .modal-backdrop');
    modals.forEach(m => m.remove());
  });

  // Capture screenshot of revenue-categories
  const ssPath = path.join(OUTPUT_DIR, '02b_revenue_categories.png');
  await page.screenshot({ path: ssPath, fullPage: true });
  console.log('Saved 02b_revenue_categories.png');

  // Extract page information
  const data = await page.evaluate(() => {
    const title = document.title;
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => h.innerText.trim()).filter(Boolean);
    const buttons = Array.from(document.querySelectorAll('button, a.btn, [role="button"]')).map(b => b.innerText.trim()).filter(Boolean);
    
    // Find all tables
    const tables = Array.from(document.querySelectorAll('table')).map(table => {
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim());
      const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => 
        Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim())
      );
      return { headers, rowCount: rows.length, rows };
    });

    const inputs = Array.from(document.querySelectorAll('input, select')).map(i => ({
      name: i.name,
      placeholder: i.placeholder,
      type: i.type,
      value: i.value
    }));

    return { title, headings, buttons: [...new Set(buttons)], tables, inputs };
  });

  fs.writeFileSync(path.join(DATA_DIR, 'revenue_categories_page.json'), JSON.stringify(data, null, 2));
  console.log('Saved revenue_categories_page.json');

  // Let's also check if there is a detail modal or action on row click
  const detailClicked = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    if (rows.length > 0) {
      const clickTarget = rows[0].querySelector('td:last-child button, td:last-child a, td:first-child a, td:nth-child(2)');
      if (clickTarget) {
        clickTarget.click();
        return true;
      }
    }
    return false;
  });

  if (detailClicked) {
    console.log('Clicked row/action in revenue-categories table...');
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02b_revenue_categories_detail_modal.png') });
    console.log('Saved 02b_revenue_categories_detail_modal.png');

    const modalData = await page.evaluate(() => {
      const modal = document.querySelector('.modal, [role="dialog"], .ant-modal, div.custom-modal, div[tabindex="-1"]');
      if (!modal) return null;
      return {
        text: modal.innerText,
        labels: Array.from(modal.querySelectorAll('label')).map(l => l.innerText.trim()),
        inputs: Array.from(modal.querySelectorAll('input, select, textarea')).map(i => ({
          name: i.name,
          type: i.type,
          value: i.value,
          placeholder: i.placeholder
        }))
      };
    });
    fs.writeFileSync(path.join(DATA_DIR, 'modal_revenue_category_detail.json'), JSON.stringify(modalData, null, 2));
  }

  await browser.close();
  console.log('Done crawling revenue categories!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

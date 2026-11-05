const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'https://app-dev.ecoschool.com.vn';
const SCHOOL_CODE = '7900004033';
const OUTPUT_DIR = path.resolve(__dirname, 'screenshots');
const DATA_DIR = path.resolve(__dirname, 'data');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Raw cookie string provided by user
const COOKIE_STRING = process.env.PORTAL_COOKIE || "";

function parseCookies(cookieStr, url) {
  return cookieStr.split(';').map(pair => {
    const trimmed = pair.trim();
    if (!trimmed) return null;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) return null;
    const name = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    
    // Cookie attributes according to name
    const cookie = {
      name,
      value,
      url: url
    };
    if (name.startsWith('__Host-')) {
      cookie.secure = true;
      cookie.path = '/';
      // __Host- cookies MUST NOT have domain set, only url/path
    } else if (name.startsWith('__Secure-')) {
      cookie.secure = true;
    }
    return cookie;
  }).filter(Boolean);
}

const targetRoutes = [
  { name: '01_overview', path: `/${SCHOOL_CODE}/overview/` },
  { name: '02_school_fees', path: `/${SCHOOL_CODE}/school/school-fees/` },
  { name: '03_setting_fee', path: `/${SCHOOL_CODE}/setting/fee/` },
  { name: '04_setting_fee_custom', path: `/${SCHOOL_CODE}/setting/fee/custom/` },
  { name: '05_tuition_management', path: `/${SCHOOL_CODE}/school/tuition-management/` },
  { name: '06_fee_students', path: `/${SCHOOL_CODE}/school/fee/` },
  { name: '07_fee_by_invoice', path: `/${SCHOOL_CODE}/school/fee/by-invoice/` },
  { name: '08_expenses', path: `/${SCHOOL_CODE}/school/expenses/` },
  { name: '09_expenses_categories', path: `/${SCHOOL_CODE}/school/expenses/categories/` },
  { name: '10_reconciliation', path: `/${SCHOOL_CODE}/school/reconciliation/` },
  { name: '11_report_fee_overview', path: `/${SCHOOL_CODE}/reports/fee/overview/` }
];

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  const cookies = parseCookies(COOKIE_STRING, BASE_URL);
  console.log(`Setting ${cookies.length} cookies...`);
  for (const c of cookies) {
    try {
      await page.setCookie(c);
    } catch (e) {
      console.warn(`Failed to set cookie ${c.name}: ${e.message}`);
    }
  }

  // Capture API calls
  const apiLogs = [];
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/') || url.includes('/graphql') || url.includes('_next/data')) {
      try {
        const status = response.status();
        const headers = response.headers();
        let body = null;
        if (headers['content-type'] && headers['content-type'].includes('application/json')) {
          body = await response.json();
        }
        apiLogs.push({ url, status, body });
      } catch (e) {
        // ignore parse error
      }
    }
  });

  for (const route of targetRoutes) {
    const fullUrl = `${BASE_URL}${route.path}`;
    console.log(`\nNavigating to ${route.name}: ${fullUrl}`);
    try {
      await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 35000 });
      await new Promise(r => setTimeout(r, 3000)); // wait for client rendering

      // Check current URL in case of redirect
      const curUrl = page.url();
      console.log(`Current URL after nav: ${curUrl}`);

      // Take screenshot
      const ssPath = path.join(OUTPUT_DIR, `${route.name}.png`);
      await page.screenshot({ path: ssPath, fullPage: true });
      console.log(`Saved screenshot: ${ssPath}`);

      // Extract title, buttons, tables, forms
      const pageData = await page.evaluate(() => {
        const title = document.title;
        const h1 = Array.from(document.querySelectorAll('h1, h2, h3')).map(e => e.innerText.trim()).filter(Boolean);
        const buttons = Array.from(document.querySelectorAll('button, a.btn, [role="button"]')).map(e => e.innerText.trim()).filter(Boolean);
        const tables = Array.from(document.querySelectorAll('table')).map(table => {
          const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim());
          const rows = Array.from(table.querySelectorAll('tbody tr')).slice(0, 15).map(tr => 
            Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim())
          );
          return { headers, rowCount: table.querySelectorAll('tbody tr').length, sampleRows: rows };
        });
        const inputs = Array.from(document.querySelectorAll('input, select, textarea')).map(input => ({
          name: input.getAttribute('name'),
          placeholder: input.getAttribute('placeholder'),
          type: input.getAttribute('type'),
          value: input.value
        })).filter(i => i.name || i.placeholder);

        // Also grab __NEXT_DATA__
        let nextData = null;
        try {
          const el = document.getElementById('__NEXT_DATA__');
          if (el) nextData = JSON.parse(el.innerText);
        } catch (e) {}

        return { title, headings: h1, buttons: [...new Set(buttons)], tables, inputs, nextDataProps: nextData ? nextData.props : null };
      });

      fs.writeFileSync(path.join(DATA_DIR, `${route.name}.json`), JSON.stringify(pageData, null, 2));
      console.log(`Saved page structure & data: ${route.name}.json`);

    } catch (err) {
      console.error(`Error crawling ${route.name}:`, err.message);
    }
  }

  // Save all intercepted API logs
  fs.writeFileSync(path.join(DATA_DIR, 'api_intercepted.json'), JSON.stringify(apiLogs, null, 2));
  console.log(`\nSaved ${apiLogs.length} API logs to api_intercepted.json`);

  await browser.close();
  console.log('Finished crawling!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

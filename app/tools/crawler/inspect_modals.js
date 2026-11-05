const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'https://app-dev.ecoschool.com.vn';
const SCHOOL_CODE = '7900004033';
const OUTPUT_DIR = path.resolve(__dirname, 'screenshots');

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

  console.log('Navigating to school-fees...');
  await page.goto(`${BASE_URL}/${SCHOOL_CODE}/school/school-fees/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Find button "Thêm khoản phí"
  const addBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button, a.btn, [role="button"]'));
    return btns.find(b => b.innerText.includes('Thêm khoản phí'));
  });

  if (addBtn) {
    console.log('Clicking "Thêm khoản phí"...');
    await addBtn.click();
    await new Promise(r => setTimeout(r, 1500));

    // Screenshot modal
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_school_fees_modal_add.png') });
    console.log('Saved 02_school_fees_modal_add.png');

    // Inspect modal inputs & labels
    const modalInfo = await page.evaluate(() => {
      const modal = document.querySelector('.modal, [role="dialog"], .ant-modal, div[tabindex="-1"]');
      if (!modal) return 'No modal found';
      return {
        text: modal.innerText,
        html: modal.innerHTML.slice(0, 3000),
        labels: Array.from(modal.querySelectorAll('label')).map(l => l.innerText.trim()),
        inputs: Array.from(modal.querySelectorAll('input, select, textarea')).map(i => ({
          name: i.name,
          placeholder: i.placeholder,
          type: i.type,
          value: i.value
        }))
      };
    });
    fs.writeFileSync(path.join(__dirname, 'data/modal_add_school_fee.json'), JSON.stringify(modalInfo, null, 2));
    console.log('Saved modal_add_school_fee.json');
  } else {
    console.log('Button "Thêm khoản phí" not found');
  }

  // Also click on row 3 edit action button to see Edit Modal
  const editBtn = await page.evaluateHandle(() => {
    // Actions are usually svg / icons in the last column
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    for (const r of rows) {
      const lastTd = r.querySelector('td:last-child');
      if (lastTd) {
        const btn = lastTd.querySelector('button, a, svg');
        if (btn) return btn;
      }
    }
    return null;
  });

  if (editBtn) {
    console.log('Found an action button in table, testing...');
  }

  // Let's also check /school/tuition-management/ class click
  console.log('Navigating to tuition management class detail...');
  await page.goto(`${BASE_URL}/${SCHOOL_CODE}/school/tuition-management/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Find first class link
  const classLink = await page.evaluate(() => {
    const a = document.querySelector('table tbody tr a');
    return a ? a.href : null;
  });
  console.log('First class link:', classLink);
  if (classLink) {
    await page.goto(classLink, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05_tuition_management_class_detail.png'), fullPage: true });
    console.log('Saved 05_tuition_management_class_detail.png');

    const classDetailData = await page.evaluate(() => {
      const title = document.title;
      const tables = Array.from(document.querySelectorAll('table')).map(table => ({
        headers: Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim()),
        rows: Array.from(table.querySelectorAll('tbody tr')).slice(0, 5).map(tr => 
          Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim())
        )
      }));
      return { title, tables };
    });
    fs.writeFileSync(path.join(__dirname, 'data/tuition_class_detail.json'), JSON.stringify(classDetailData, null, 2));
  }

  // Also check /school/fee/ create invoice modal or page
  console.log('Navigating to fee create invoice...');
  await page.goto(`${BASE_URL}/${SCHOOL_CODE}/school/fee/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const createInvBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button, a.btn, [role="button"]'));
    return btns.find(b => b.innerText.includes('Tạo hóa đơn'));
  });
  if (createInvBtn) {
    console.log('Clicking "Tạo hóa đơn"...');
    await createInvBtn.click();
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06_fee_modal_create_invoice.png') });
    console.log('Saved 06_fee_modal_create_invoice.png');
    const invModalInfo = await page.evaluate(() => {
      const modal = document.querySelector('.modal, [role="dialog"], .ant-modal, div[tabindex="-1"]');
      if (!modal) return 'No modal found';
      return {
        text: modal.innerText,
        labels: Array.from(modal.querySelectorAll('label')).map(l => l.innerText.trim()),
        inputs: Array.from(modal.querySelectorAll('input, select, textarea')).map(i => ({
          name: i.name,
          placeholder: i.placeholder,
          type: i.type,
          value: i.value
        }))
      };
    });
    fs.writeFileSync(path.join(__dirname, 'data/modal_create_invoice.json'), JSON.stringify(invModalInfo, null, 2));
  }

  await browser.close();
  console.log('Inspect script done!');
}

main().catch(err => {
  console.error('Inspect error:', err);
  process.exit(1);
});

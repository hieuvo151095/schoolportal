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

async function dismissAnnouncement(page) {
  try {
    const closeBtn = await page.$('.system-announcement-modal button, [data-tooltip-content="Đóng"], .modal-close');
    if (closeBtn) {
      console.log('Dismissing announcement modal...');
      await closeBtn.click();
      await new Promise(r => setTimeout(r, 1000));
    }
  } catch (e) {}
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

  // --- 1. /school/school-fees ---
  console.log('Navigating to school-fees...');
  await page.goto(`${BASE_URL}/${SCHOOL_CODE}/school/school-fees/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await dismissAnnouncement(page);

  // Take fresh clean screenshot of table
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_school_fees_clean.png'), fullPage: true });

  // Click "Thêm khoản phí"
  const addFeeBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button, [role="button"]'));
    return btns.find(b => b.innerText.includes('Thêm khoản phí'));
  });

  if (addFeeBtn) {
    console.log('Clicking "Thêm khoản phí"...');
    await addFeeBtn.click();
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_modal_add_school_fee.png') });

    const modalData = await page.evaluate(() => {
      const modal = document.querySelector('.modal, [role="dialog"], .ant-modal, div.custom-modal, div[tabindex="-1"]');
      if (!modal) return null;
      return {
        title: modal.querySelector('h1, h2, h3, .modal-title, .title')?.innerText || '',
        text: modal.innerText,
        formFields: Array.from(modal.querySelectorAll('.form-group, .form-item, label')).map(el => el.innerText.trim()).filter(Boolean),
        inputs: Array.from(modal.querySelectorAll('input, select, textarea')).map(i => ({
          name: i.name,
          type: i.type,
          placeholder: i.placeholder,
          value: i.value,
          checked: i.checked
        }))
      };
    });
    fs.writeFileSync(path.join(DATA_DIR, 'modal_add_school_fee_details.json'), JSON.stringify(modalData, null, 2));
    console.log('Saved modal_add_school_fee_details.json');

    // Close add modal (find close button or cancel)
    await page.evaluate(() => {
      const closeBtn = document.querySelector('.modal button, [data-tooltip-content="Đóng"], button:has(svg)');
      const cancelBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Hủy') || b.innerText.includes('Đóng'));
      if (cancelBtn) cancelBtn.click();
      else if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
  }

  // Click Edit on Row 3 (Bảo hiểm)
  console.log('Clicking edit on row 3...');
  const editSuccess = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    // row 2 (0-indexed) is Bảo hiểm
    if (rows.length >= 3) {
      const lastTd = rows[2].querySelector('td:last-child');
      const btn = lastTd?.querySelector('button, a, svg');
      if (btn) {
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        return true;
      }
    }
    return false;
  });

  if (editSuccess) {
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_modal_edit_school_fee.png') });
    const editModalData = await page.evaluate(() => {
      const modal = document.querySelector('.modal, [role="dialog"], .ant-modal, div.custom-modal, div[tabindex="-1"]');
      if (!modal) return null;
      return {
        text: modal.innerText,
        inputs: Array.from(modal.querySelectorAll('input, select, textarea')).map(i => ({
          name: i.name,
          type: i.type,
          value: i.value,
          checked: i.checked
        }))
      };
    });
    fs.writeFileSync(path.join(DATA_DIR, 'modal_edit_school_fee_details.json'), JSON.stringify(editModalData, null, 2));
    console.log('Saved modal_edit_school_fee_details.json');
  }

  // --- 2. /school/tuition-management/ ---
  console.log('\nNavigating to tuition-management...');
  await page.goto(`${BASE_URL}/${SCHOOL_CODE}/school/tuition-management/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await dismissAnnouncement(page);

  // Look at row 1 (10 Phổ cập) or row 2 (10A) action buttons
  const editTuitionSuccess = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    for (const r of rows) {
      const lastTd = r.querySelector('td:last-child');
      const btn = lastTd?.querySelector('button, a, svg');
      if (btn) {
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        return true;
      }
    }
    return false;
  });

  if (editTuitionSuccess) {
    console.log('Clicked edit tuition on first class row...');
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05_tuition_management_modal_edit.png') });
    const tmModalData = await page.evaluate(() => {
      const modal = document.querySelector('.modal, [role="dialog"], .ant-modal, div.custom-modal, div[tabindex="-1"]');
      if (!modal) return null;
      return {
        text: modal.innerText,
        inputs: Array.from(modal.querySelectorAll('input, select, textarea')).map(i => ({
          name: i.name,
          type: i.type,
          value: i.value
        }))
      };
    });
    fs.writeFileSync(path.join(DATA_DIR, 'modal_edit_tuition_details.json'), JSON.stringify(tmModalData, null, 2));
    console.log('Saved modal_edit_tuition_details.json');
  }

  // --- 3. /school/fee/ ---
  console.log('\nNavigating to fee...');
  await page.goto(`${BASE_URL}/${SCHOOL_CODE}/school/fee/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await dismissAnnouncement(page);

  // Click "Tạo hóa đơn"
  const createInvBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button, [role="button"]'));
    return btns.find(b => b.innerText.includes('Tạo hóa đơn'));
  });

  if (createInvBtn) {
    console.log('Clicking "Tạo hóa đơn"...');
    await createInvBtn.click();
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06_fee_create_invoice_clean.png') });
    console.log('Current URL after clicking Tạo hóa đơn:', page.url());

    const invPageData = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        text: document.body.innerText.slice(0, 3000),
        headings: Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => h.innerText.trim()),
        labels: Array.from(document.querySelectorAll('label')).map(l => l.innerText.trim()),
        buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean),
        inputs: Array.from(document.querySelectorAll('input, select, textarea')).map(i => ({
          name: i.name,
          placeholder: i.placeholder,
          type: i.type,
          value: i.value
        }))
      };
    });
    fs.writeFileSync(path.join(DATA_DIR, 'create_invoice_page_details.json'), JSON.stringify(invPageData, null, 2));
    console.log('Saved create_invoice_page_details.json');
  }

  await browser.close();
  console.log('Deep crawl finished successfully!');
}

main().catch(err => {
  console.error('Deep crawl error:', err);
  process.exit(1);
});

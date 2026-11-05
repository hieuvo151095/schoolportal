import assert from 'node:assert/strict';

async function verifyAttendanceAndActivity() {
  console.log('Testing Attendance & Activity features against dev server...');

  // 1. Fetch attendance page for lop-1a1
  const res1a1 = await fetch('http://localhost:3000/demo/class/lop-1a1/attendance');
  assert.equal(res1a1.status, 200, 'Attendance 1A1 should return 200');
  const html1a1 = await res1a1.text();

  // Verify deleted buttons: "In sổ điểm danh" and "Đồng bộ dữ liệu" are NOT present
  assert.ok(!html1a1.includes('In sổ điểm danh'), 'In sổ điểm danh button must be deleted');
  assert.ok(!html1a1.includes('Đồng bộ dữ liệu'), 'Đồng bộ dữ liệu button must be deleted');
  console.log('✔ Header buttons "In sổ điểm danh" and "Đồng bộ dữ liệu" are successfully removed.');

  // Verify Bulk Action buttons exist in toolbar
  assert.ok(html1a1.includes('Đón hàng loạt'), 'Toolbar should have "Đón hàng loạt"');
  assert.ok(html1a1.includes('Trả hàng loạt'), 'Toolbar should have "Trả hàng loạt"');
  assert.ok(html1a1.includes('Chọn tất cả'), 'Toolbar should have "Chọn tất cả"');
  console.log('✔ Bulk action toolbar buttons present.');

  // 2. Fetch attendance page for lop-1a2
  const res1a2 = await fetch('http://localhost:3000/demo/class/lop-1a2/attendance');
  assert.equal(res1a2.status, 200, 'Attendance 1A2 should return 200');
  const html1a2 = await res1a2.text();
  assert.ok(html1a2.includes('Lớp 1A2') || html1a2.includes('Cô Lê Thanh Thảo') || html1a2.includes('Hoàng Đức Minh'), 'Attendance 1A2 should render class 1A2 info');
  console.log('✔ Class 1A2 attendance page rendered properly.');

  // 3. Fetch activity page for lop-1a1
  const resAct = await fetch('http://localhost:3000/demo/class/lop-1a1/activity');
  assert.equal(resAct.status, 200, 'Activity 1A1 should return 200');
  const htmlAct = await resAct.text();

  // Verify comment and sharing icons are deleted
  assert.ok(!htmlAct.includes('bình luận'), 'Comments count/text should be deleted from activity posts');
  assert.ok(!htmlAct.includes('Chia sẻ liên kết'), 'Share button should be deleted from activity posts');
  console.log('✔ Comments and Share icons are deleted from each post.');

  // Verify composer placeholder mentions @
  assert.ok(htmlAct.includes('Gõ @ để gắn thẻ học sinh'), 'Composer placeholder mentions @ trigger');
  console.log('✔ Composer @ mention placeholder is present.');

  console.log('\nAll integration DOM assertions passed successfully!');
}

verifyAttendanceAndActivity().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

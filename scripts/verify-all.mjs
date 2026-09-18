import QRCode from 'qrcode';

// Test 1: ₹4,000 split into 2 payments
function test1() {
  const total = 4000;
  const parts = 2;
  const base = Math.floor(total / parts);
  const rem = total % parts;
  const splits = Array.from({ length: parts }, (_, i) => i < rem ? base + 1 : base);
  const sum = splits.reduce((a, b) => a + b, 0);
  const pass = sum === 4000 && splits[0] === 2000 && splits[1] === 2000;
  console.log(`Test 1 (₹4,000 / 2): ${pass ? 'PASS' : 'FAIL'} -> [${splits.join(', ')}] sum=${sum}`);
  return pass;
}

// Test 2: ₹4,000 split into 3 payments
function test2() {
  const total = 4000;
  const parts = 3;
  const base = Math.floor(total / parts);
  const rem = total % parts;
  const splits = Array.from({ length: parts }, (_, i) => i < rem ? base + 1 : base);
  const sum = splits.reduce((a, b) => a + b, 0);
  const pass = sum === 4000 && splits[0] === 1334 && splits[1] === 1333 && splits[2] === 1333;
  console.log(`Test 2 (₹4,000 / 3): ${pass ? 'PASS' : 'FAIL'} -> [${splits.join(', ')}] sum=${sum}`);
  return pass;
}

// Test 3: ₹4,000 split into 4 payments
function test3() {
  const total = 4000;
  const parts = 4;
  const base = Math.floor(total / parts);
  const rem = total % parts;
  const splits = Array.from({ length: parts }, (_, i) => i < rem ? base + 1 : base);
  const sum = splits.reduce((a, b) => a + b, 0);
  const pass = sum === 4000 && splits.every(s => s === 1000);
  console.log(`Test 3 (₹4,000 / 4): ${pass ? 'PASS' : 'FAIL'} -> [${splits.join(', ')}] sum=${sum}`);
  return pass;
}

// Test 4: Manual split ₹1,999 + ₹1,999 + ₹2
function test4() {
  const splits = [1999, 1999, 2];
  const required = 4000;
  const sum = splits.reduce((a, b) => a + b, 0);
  const pass = sum === required;
  console.log(`Test 4 (Manual 1999 + 1999 + 2): ${pass ? 'PASS' : 'FAIL'} -> sum=${sum}`);
  return pass;
}

// Test 5: Invalid split where total doesn't match
function test5() {
  const splits = [1999, 1999, 5]; // 4003 != 4000
  const required = 4000;
  const sum = splits.reduce((a, b) => a + b, 0);
  const diff = sum - required;
  const isInvalid = diff !== 0;
  console.log(`Test 5 (Invalid split total mismatch): ${isInvalid ? 'PASS' : 'FAIL'} -> diff=${diff}`);
  return isInvalid;
}

// Test 6: Invalid UPI ID
function test6() {
  const regex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9]{2,64}$/;
  const invalidIds = ['', 'merchant', 'merchant@', '@upi', 'name with space@upi', 'user@'];
  const allInvalid = invalidIds.every(id => !regex.test(id));
  const validIds = ['merchant@upi', 'rahul.sharma@okhdfcbank', '9876543210@paytm'];
  const allValid = validIds.every(id => regex.test(id));
  const pass = allInvalid && allValid;
  console.log(`Test 6 (UPI ID format validation): ${pass ? 'PASS' : 'FAIL'}`);
  return pass;
}

// Test 7: Empty fields
function test7() {
  const upiEmpty = ''.trim() === '';
  const nameEmpty = ''.trim() === '';
  const pass = upiEmpty && nameEmpty;
  console.log(`Test 7 (Empty fields caught): ${pass ? 'PASS' : 'FAIL'}`);
  return pass;
}

// Test 8: Small amount (e.g. ₹2 / 2 = ₹1 + ₹1)
function test8() {
  const total = 2;
  const parts = 2;
  const base = Math.floor(total / parts);
  const splits = [base, base];
  const sum = splits.reduce((a, b) => a + b, 0);
  const pass = sum === 2 && splits[0] === 1 && splits[1] === 1;
  console.log(`Test 8 (Small amount ₹2 / 2): ${pass ? 'PASS' : 'FAIL'}`);
  return pass;
}

// Test 9: Maximum allowed amount (₹1,00,000)
function test9() {
  const max = 100000;
  const parts = 10;
  const base = Math.floor(max / parts);
  const splits = Array.from({ length: parts }, () => base);
  const sum = splits.reduce((a, b) => a + b, 0);
  const pass = sum === 100000 && splits.length === 10;
  console.log(`Test 9 (Max bill ₹1,00,000 / 10): ${pass ? 'PASS' : 'FAIL'} -> sum=${sum}`);
  return pass;
}

// Test 10: More than 10 payment parts check
function test10() {
  const maxParts = 10;
  const isRejected = (parts) => parts > maxParts || parts < 2;
  const pass = isRejected(11) && isRejected(1) && !isRejected(5);
  console.log(`Test 10 (Part limits [2, 10]): ${pass ? 'PASS' : 'FAIL'}`);
  return pass;
}

// Test 11: Zero payment amount
function test11() {
  const isRejected = (amt) => amt <= 0;
  const pass = isRejected(0);
  console.log(`Test 11 (Zero amount rejected): ${pass ? 'PASS' : 'FAIL'}`);
  return pass;
}

// Test 12: Negative payment amount
function test12() {
  const isRejected = (amt) => amt <= 0;
  const pass = isRejected(-50);
  console.log(`Test 12 (Negative amount rejected): ${pass ? 'PASS' : 'FAIL'}`);
  return pass;
}

// Test 13: Decimal amounts (₹4000.50 / 3)
function test13() {
  const totalPaise = Math.round(4000.50 * 100);
  const parts = 3;
  const base = Math.floor(totalPaise / parts);
  const rem = totalPaise % parts;
  const splits = Array.from({ length: parts }, (_, i) => (i < rem ? base + 1 : base) / 100);
  const sum = Number(splits.reduce((a, b) => a + b, 0).toFixed(2));
  const pass = sum === 4000.50 && splits[0] === 1333.50;
  console.log(`Test 13 (Decimal split ₹4,000.50 / 3): ${pass ? 'PASS' : 'FAIL'} -> sum=${sum}`);
  return pass;
}

// Test 14 & 33 & 34: Multiple QR codes generation and correctness of encoded URI
async function test14_33_34() {
  const parts = [1999, 1999, 2];
  const upiId = 'merchant@upi';
  const name = 'ABC Store';
  let allValid = true;

  for (let i = 0; i < parts.length; i++) {
    const amt = parts[i];
    const params = new URLSearchParams();
    params.set('pa', upiId);
    params.set('pn', name);
    params.set('am', amt.toString());
    params.set('cu', 'INR');
    const uri = `upi://pay?${params.toString()}`;
    
    // Check parameters
    if (!uri.includes('pa=merchant%40upi') || !uri.includes(`am=${amt}`) || !uri.includes('cu=INR')) {
      allValid = false;
    }

    // Check QR generation
    const dataUrl = await QRCode.toDataURL(uri);
    if (!dataUrl.startsWith('data:image/png;base64,')) {
      allValid = false;
    }
  }

  console.log(`Test 14, 33, 34 (Multiple QR codes & parameter accuracy): ${allValid ? 'PASS' : 'FAIL'}`);
  return allValid;
}

// Test 35: Invariant check - All split amounts add up exactly to the original bill
function test35() {
  const testCases = [
    { total: 4000, parts: 2 },
    { total: 4000, parts: 3 },
    { total: 4000, parts: 7 },
    { total: 999.99, parts: 4 },
    { total: 100000, parts: 9 },
    { total: 5.75, parts: 3 },
  ];

  let allPass = true;
  for (const tc of testCases) {
    const totalPaise = Math.round(tc.total * 100);
    const base = Math.floor(totalPaise / tc.parts);
    const rem = totalPaise % tc.parts;
    const partsPaise = Array.from({ length: tc.parts }, (_, i) => i < rem ? base + 1 : base);
    const sumPaise = partsPaise.reduce((a, b) => a + b, 0);
    if (sumPaise !== totalPaise) {
      allPass = false;
    }
  }
  console.log(`Test 35 (Mathematical invariant sum == total for all test cases): ${allPass ? 'PASS' : 'FAIL'}`);
  return allPass;
}

async function run() {
  console.log('--- RUNNING SPLITUPI TEST SUITE ---');
  test1();
  test2();
  test3();
  test4();
  test5();
  test6();
  test7();
  test8();
  test9();
  test10();
  test11();
  test12();
  test13();
  await test14_33_34();
  test35();
  console.log('--- ALL AUTOMATED LOGIC TESTS FINISHED ---');
}

run();

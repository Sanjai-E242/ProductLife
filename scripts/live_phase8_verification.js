const http = require('http');
const fs = require('fs');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = body ? JSON.parse(body) : null;
        } catch (e) {
          parsed = body;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed,
          raw: body
        });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function run() {
  const results = [];
  function check(name, pass, details = '') {
    results.push({ name, pass, details });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}${details ? ' - ' + details : ''}`);
    if (!pass) throw new Error(`Verification failed at check: ${name}`);
  }

  console.log('===============================================================');
  console.log('       LIVE PHASE 8 INTEGRATION VERIFICATION SUITE             ');
  console.log('===============================================================\n');

  // --- Check 1: Health & Database Connectivity ---
  console.log('STEP 1: Backend Health & Database Connectivity');
  const health = await request({ host: 'localhost', port: 8081, path: '/api/health', method: 'GET' });
  check('Backend Health & DB Check (GET /api/health)', health.statusCode === 200 && health.data.database === 'CONNECTED', `HTTP ${health.statusCode}, DB: ${health.data.database}`);

  // --- Check 2: Confirm Baseline 4 Products Intact ---
  console.log('\nSTEP 2: Verify Baseline 4 Products in Database');
  const productsRes = await request({ host: 'localhost', port: 8081, path: '/api/products', method: 'GET' });
  check('Public Products List Status', productsRes.statusCode === 200, `HTTP ${productsRes.statusCode}`);
  const products = productsRes.data;
  check('Total Products Count is 4', Array.isArray(products) && products.length === 4, `Found ${products.length} products`);

  const expectedProducts = [
    { id: 1, code: 'PL-ECO-001', name: 'HydroPure Thermal Flask 750ml' },
    { id: 2, code: 'PL-TEX-002', name: 'PureStride Circular Running Sneaker' },
    { id: 3, code: 'PL-ELE-003', name: 'Modular Sound Wireless Headphones' },
    { id: 4, code: 'PL-OUT-004', name: 'TerraShield Solar Exploration Backpack' }
  ];

  for (const exp of expectedProducts) {
    const found = products.find(p => p.id === exp.id && p.productCode === exp.code);
    check(`Baseline Product ${exp.code} Intact`, Boolean(found && found.name.includes(exp.name.slice(0, 15))), `ID: ${exp.id}, Code: ${exp.code}, Name: "${found ? found.name : 'MISSING'}"`);
  }

  // --- Check 3: Confirm Baseline 3 Seeded Repair Records Intact ---
  console.log('\nSTEP 3: Verify Baseline 3 Seeded Repair Records');
  const p1Detail = await request({ host: 'localhost', port: 8081, path: '/api/products/1', method: 'GET' });
  const p2Detail = await request({ host: 'localhost', port: 8081, path: '/api/products/2', method: 'GET' });
  const p3Detail = await request({ host: 'localhost', port: 8081, path: '/api/products/3', method: 'GET' });
  const p4Detail = await request({ host: 'localhost', port: 8081, path: '/api/products/4', method: 'GET' });

  const p1Repairs = p1Detail.data.repairHistory || [];
  const p2Repairs = p2Detail.data.repairHistory || [];
  const p3Repairs = p3Detail.data.repairHistory || [];
  const p4Repairs = p4Detail.data.repairHistory || [];

  const totalRepairs = p1Repairs.length + p2Repairs.length + p3Repairs.length + p4Repairs.length;
  check('Product 1 Repair Count is 1', p1Repairs.length === 1, `Found ${p1Repairs.length} repair(s)`);
  check('Product 2 Repair Count is 0', p2Repairs.length === 0, `Found ${p2Repairs.length} repair(s)`);
  check('Product 3 Repair Count is 2', p3Repairs.length === 2, `Found ${p3Repairs.length} repair(s)`);
  check('Product 4 Repair Count is 0', p4Repairs.length === 0, `Found ${p4Repairs.length} repair(s)`);
  check('Total Existing Repair Records is Exactly 3', totalRepairs === 3, `Total baseline repairs: ${totalRepairs}`);

  // Confirm specific repair content
  check('Seeded Repair 1 (Stockholm Hub) Intact', p1Repairs[0] && p1Repairs[0].serviceCenter.includes('Stockholm'), `Service Center: "${p1Repairs[0]?.serviceCenter}"`);
  check('Seeded Repair 2 (Berlin Lab) Intact', p3Repairs.some(r => r.serviceCenter.includes('Berlin')), `Found Berlin service center log`);
  check('Seeded Repair 3 (Munich Diagnostics) Intact', p3Repairs.some(r => r.serviceCenter.includes('Munich')), `Found Munich service center log`);

  // --- Check 4: Public QR Generation for All 4 Products ---
  console.log('\nSTEP 4: Public QR Code Endpoint Verification');
  for (let id = 1; id <= 4; id++) {
    const qrRes = await request({ host: 'localhost', port: 8081, path: `/api/products/${id}/qrcode?size=260`, method: 'GET' });
    const isPng = qrRes.headers['content-type'] && qrRes.headers['content-type'].includes('image/png');
    check(`Public QR Code Generation for Product ${id}`, qrRes.statusCode === 200 && isPng, `HTTP ${qrRes.statusCode}, Content-Type: ${qrRes.headers['content-type']}`);
  }

  // --- Check 5: Admin Authentication Security ---
  console.log('\nSTEP 5: Administrator Authentication & Authorization Security');
  const unauthRepairs = await request({ host: 'localhost', port: 8081, path: '/api/admin/products/1/repairs', method: 'GET' });
  check('Unauthenticated Admin Repairs Rejected', unauthRepairs.statusCode === 401, `HTTP ${unauthRepairs.statusCode} Unauthorized`);

  const unauthProducts = await request({ host: 'localhost', port: 8081, path: '/api/admin/products', method: 'GET' });
  check('Unauthenticated Admin Products Rejected', unauthProducts.statusCode === 401, `HTTP ${unauthProducts.statusCode} Unauthorized`);

  const badLogin = await request({
    host: 'localhost',
    port: 8081,
    path: '/api/admin/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { username: 'admin', password: 'DefinitivelyWrongPassword999!' });
  check('Invalid Admin Password Rejected', badLogin.statusCode === 401, `HTTP ${badLogin.statusCode} Unauthorized`);

  // Load configured admin credentials from environment or backend/.env securely
  let adminUsername = process.env.ADMIN_USERNAME || 'admin';
  let adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const path = require('path');
  const envPath = path.resolve(__dirname, '../backend/.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const l of lines) {
      if (l.startsWith('ADMIN_PASSWORD=')) adminPassword = l.split('=', 2)[1].trim();
      if (l.startsWith('ADMIN_USERNAME=')) adminUsername = l.split('=', 2)[1].trim();
    }
  }

  const validLogin = await request({
    host: 'localhost',
    port: 8081,
    path: '/api/admin/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { username: adminUsername, password: adminPassword });
  check('Valid Admin Authentication Succeeded', validLogin.statusCode === 200 && Boolean(validLogin.data?.token), `HTTP ${validLogin.statusCode}, Token Issued`);
  const token = validLogin.data.token;

  // --- Check 6: Repair-Management CRUD Functionality ---
  console.log('\nSTEP 6: Repair Management Lifecycle CRUD (Under Admin Auth)');
  const adminRepairs = await request({
    host: 'localhost',
    port: 8081,
    path: '/api/admin/products/1/repairs',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  check('Authorized GET Admin Repairs', adminRepairs.statusCode === 200 && Array.isArray(adminRepairs.data), `HTTP ${adminRepairs.statusCode}, Count: ${adminRepairs.data.length}`);

  // Create temporary repair record
  const createRepairRes = await request({
    host: 'localhost',
    port: 8081,
    path: '/api/admin/products/1/repairs',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, {
    repairDate: '2026-10-11',
    serviceCenter: 'Authorized Clean Tech Lab',
    description: 'Acoustic seal vibration damping calibration',
    partsReplaced: 'Damping Ring',
    technicianNotes: 'Verified calibration and signal response'
  });
  check('Create New Repair Record (POST)', createRepairRes.statusCode === 201 && Boolean(createRepairRes.data?.id), `HTTP ${createRepairRes.statusCode}, Created ID: ${createRepairRes.data?.id}`);
  const tempRepairId = createRepairRes.data.id;

  // Update temporary repair record
  const updateRepairRes = await request({
    host: 'localhost',
    port: 8081,
    path: `/api/admin/products/1/repairs/${tempRepairId}`,
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, {
    repairDate: '2026-10-11',
    serviceCenter: 'Authorized Clean Tech Lab',
    description: 'Acoustic seal vibration damping calibration - COMPLETED',
    partsReplaced: 'Damping Ring (Upgraded v2)',
    technicianNotes: 'Final acoustic test passed 100%'
  });
  check('Update Existing Repair Record (PUT)', updateRepairRes.statusCode === 200 && updateRepairRes.data?.partsReplaced === 'Damping Ring (Upgraded v2)', `HTTP ${updateRepairRes.statusCode}, Updated parts: "${updateRepairRes.data?.partsReplaced}"`);

  // Delete temporary repair record
  const deleteRepairRes = await request({
    host: 'localhost',
    port: 8081,
    path: `/api/admin/products/1/repairs/${tempRepairId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  check('Delete Repair Record (DELETE)', deleteRepairRes.statusCode === 200, `HTTP ${deleteRepairRes.statusCode}`);

  // Verify Product 1 repairs returned to exactly 1
  const postDeleteRepairs = await request({
    host: 'localhost',
    port: 8081,
    path: '/api/admin/products/1/repairs',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  check('Product 1 Repairs Reverted to Baseline Count', postDeleteRepairs.statusCode === 200 && postDeleteRepairs.data.length === 1, `Count: ${postDeleteRepairs.data.length}`);

  // --- Check 7: Digital Product Passport Compliance Export ---
  console.log('\nSTEP 7: EU DPP Compliance Export Verification');
  for (let id = 1; id <= 4; id++) {
    const exportRes = await request({
      host: 'localhost',
      port: 8081,
      path: `/api/products/${id}/export/json`,
      method: 'GET'
    });
    check(`Public DPP Compliance JSON Export for Product ${id}`, exportRes.statusCode === 200, `HTTP ${exportRes.statusCode}`);
    const dpp = exportRes.data;
    check(`DPP Export Schema Standard for Product ${id}`, dpp.header?.standardVersion === 'EU-DPP-1.0-ALIGNED', `Standard: ${dpp.header?.standardVersion}`);
    check(`DPP Export Product Details for Product ${id}`, Boolean(dpp.product?.productCode && dpp.product?.name), `Code: ${dpp.product?.productCode}`);
    check(`DPP Export Circularity Disclosures for Product ${id}`, Boolean(dpp.circularity?.materials && dpp.circularity?.recyclingInstructions), `Materials present`);
    check(`DPP Export Lifecycle Data for Product ${id}`, typeof dpp.lifecycle?.totalServiceInterventions === 'number', `Total Interventions: ${dpp.lifecycle?.totalServiceInterventions}`);
  }

  // --- Check 8: Logout Admin Session ---
  console.log('\nSTEP 8: Administrator Session Termination');
  const logoutRes = await request({
    host: 'localhost',
    port: 8081,
    path: '/api/admin/auth/logout',
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  check('Admin Logout (POST /api/admin/auth/logout)', logoutRes.statusCode === 200, `HTTP ${logoutRes.statusCode}`);

  // Re-verify that old token is now invalidated
  const invalidatedCheck = await request({
    host: 'localhost',
    port: 8081,
    path: '/api/admin/products/1/repairs',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  check('Invalidated Token Rejected on Sub-sequent Calls', invalidatedCheck.statusCode === 401, `HTTP ${invalidatedCheck.statusCode} Unauthorized`);

  // --- Check 9: Final Database Consistency Check ---
  console.log('\nSTEP 9: Final Database Record Preservation Confirmation');
  const finalProducts = await request({ host: 'localhost', port: 8081, path: '/api/products', method: 'GET' });
  const finalP1 = await request({ host: 'localhost', port: 8081, path: '/api/products/1', method: 'GET' });
  const finalP3 = await request({ host: 'localhost', port: 8081, path: '/api/products/3', method: 'GET' });
  const finalRepairsTotal = (finalP1.data.repairHistory?.length || 0) + (finalP3.data.repairHistory?.length || 0);

  check('Final Products Count Remains Exactly 4', finalProducts.data.length === 4, `Count: ${finalProducts.data.length}`);
  check('Final Total Repairs Count Remains Exactly 3', finalRepairsTotal === 3, `Count: ${finalRepairsTotal}`);

  console.log('\n===============================================================');
  console.log(`ALL ${results.length} VERIFICATION CHECKS PASSED WITH ZERO FAILURES.`);
  console.log('===============================================================');
}

run().catch(err => {
  console.error('\nVerification error occurred:', err.message);
  process.exit(1);
});

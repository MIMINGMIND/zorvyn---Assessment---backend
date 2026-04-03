import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

async function runTests() {
  await sleep(2000); // Wait for server

  console.log('--- Registering Admin ---');
  let adminRes = await api.post('/auth/register', {
    email: 'admin@finance.app',
    password: 'password123',
    role: 'ADMIN'
  });
  const adminToken = adminRes.data.token;
  console.log('Admin Token:', adminToken.substring(0, 10) + '...');

  console.log('--- Registering Viewer ---');
  let viewerRes = await api.post('/auth/register', {
    email: 'viewer@finance.app',
    password: 'password123',
    role: 'VIEWER'
  });
  const viewerToken = viewerRes.data.token;

  console.log('--- Admin creates records ---');
  await api.post('/records', {
    amount: 1500, type: 'INCOME', category: 'Salary', date: '2026-04-01', notes: 'April Salary'
  }, { headers: { Authorization: `Bearer ${adminToken}` } });
  
  await api.post('/records', {
    amount: 50, type: 'EXPENSE', category: 'Food', date: '2026-04-02', notes: 'Lunch'
  }, { headers: { Authorization: `Bearer ${adminToken}` } });
  console.log('Admin created records successfully.');

  console.log('--- Viewer attempts to create record (Should fail 403) ---');
  try {
    await api.post('/records', {
      amount: 100, type: 'INCOME', category: 'Gift', date: '2026-04-03'
    }, { headers: { Authorization: `Bearer ${viewerToken}` } });
    console.error('ERROR: Viewer should not be able to create');
  } catch (e: any) {
    if (e.response && e.response.status === 403) {
      console.log('Passed: Viewer forbidden from creating records.');
    } else {
      console.error('ERROR: Expected 403, got:', e.response?.status);
    }
  }

  console.log('--- Viewer gets dashboard summary ---');
  const summaryRes = await api.get('/dashboard/summary', { headers: { Authorization: `Bearer ${viewerToken}` } });
  console.log('Summary:', summaryRes.data);
  if (summaryRes.data.netBalance === 1450) {
    console.log('Passed: Summary values are correct.');
  }

  console.log('--- Admin gets records list ---');
  const recordsList = await api.get('/records', { headers: { Authorization: `Bearer ${adminToken}` } });
  console.log('Records count:', recordsList.data.length);
  if (recordsList.data.length === 2) {
    console.log('Passed: Admin listed records successfully.');
  }
}

runTests().catch(e => {
  console.error('Test Failed:', e?.response?.data || e.message);
});

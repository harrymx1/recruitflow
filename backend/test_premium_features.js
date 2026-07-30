const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const baseURL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING PREMIUM FEATURES TEST ---\n');
  let hrToken, candidateToken;
  let companyId, candidateId;
  let job1Id, job2Id;

  try {
    // 1. Setup HR
    console.log('1. Setting up HR user & Company...');
    const hrEmail = 'premium_hr_test@example.com';
    await pool.query('DELETE FROM company_members WHERE email = $1', [hrEmail]);
    await pool.query("DELETE FROM companies WHERE name = 'Premium Test Corp'");
    
    // Register HR User
    const authRes = await axios.post(`${baseURL}/auth/company/register`, {
      email: hrEmail,
      password: 'password123',
      companyName: 'Premium Test Corp',
      adminName: 'HR Premium'
    });
    // HR registration usually just returns success. We need to log in to get token.
    const loginRes = await axios.post(`${baseURL}/auth/company/login`, {
      email: hrEmail,
      password: 'password123'
    });
    hrToken = loginRes.data.data.accessToken;
    
    const memberRes = await pool.query('SELECT company_id FROM company_members WHERE email = $1', [hrEmail]);
    companyId = memberRes.rows[0].company_id;
    // Set profile complete manually
    await pool.query("UPDATE companies SET is_profile_complete = true, subscription_tier = 'starter' WHERE id = $1", [companyId]);

    // 2. Setup Candidate
    console.log('2. Setting up Candidate...');
    const canEmail = 'premium_can_test@example.com';
    await pool.query('DELETE FROM candidates WHERE email = $1', [canEmail]);
    
    const canAuth = await axios.post(`${baseURL}/auth/candidate/register`, {
      email: canEmail,
      password: 'password123',
      first_name: 'John',
      last_name: 'Premium'
    });
    const canLoginRes = await axios.post(`${baseURL}/auth/candidate/login`, {
      email: canEmail,
      password: 'password123'
    });
    candidateToken = canLoginRes.data.data.accessToken;
    const canDbRes = await pool.query('SELECT id FROM candidates WHERE email = $1', [canEmail]);
    const canId = canDbRes.rows[0].id;
    await pool.query('INSERT INTO candidate_profiles (candidate_id, full_name) VALUES ($1, $2)', [canId, 'John Premium']);

    // 3. Test Starter Limitation (Company)
    console.log('3. Testing Company Starter Limit...');
    // Create job 1
    const job1Res = await axios.post(`${baseURL}/dashboard/jobs`, {
      title: 'Job 1',
      department: 'Tech',
      is_published: true
    }, { headers: { Authorization: `Bearer ${hrToken}` }});
    job1Id = job1Res.data.data.id;
    console.log('   Job 1 created and published.');

    // Create job 2 - should fail publishing
    try {
      await axios.post(`${baseURL}/dashboard/jobs`, {
        title: 'Job 2',
        department: 'Tech',
        is_published: true
      }, { headers: { Authorization: `Bearer ${hrToken}` }});
      console.error('   ❌ ERROR: Job 2 published successfully, but it should have failed!');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log('   ✅ Job 2 publishing failed correctly (403).');
      } else {
        console.error('   ❌ ERROR:', err.message);
      }
    }

    // 4. Test Company Upgrade
    console.log('4. Testing Company Upgrade to Growth...');
    const upgradeRes = await axios.post(`${baseURL}/subscriptions/company/upgrade`, {
      plan_type: 'growth',
      billing_cycle: 'monthly'
    }, { headers: { Authorization: `Bearer ${hrToken}` }});
    if (upgradeRes.data.data.subscription_tier === 'growth') {
      console.log('   ✅ Company upgraded successfully.');
    }

    // Now try creating Job 2 again
    console.log('5. Testing Job Creation post-upgrade...');
    const job2Res = await axios.post(`${baseURL}/dashboard/jobs`, {
      title: 'Job 2',
      department: 'Tech',
      is_published: true
    }, { headers: { Authorization: `Bearer ${hrToken}` }});
    job2Id = job2Res.data.data.id;
    console.log('   ✅ Job 2 published successfully post-upgrade.');

    // 6. Test Candidate Upgrade
    console.log('6. Testing Candidate Upgrade to Premium...');
    const canUpgrade = await axios.post(`${baseURL}/subscriptions/candidate/upgrade`, {
      plan_type: 'premium',
      billing_cycle: 'monthly'
    }, { headers: { Authorization: `Bearer ${candidateToken}` }});
    
    if (canUpgrade.data.data.subscription_tier === 'premium') {
      console.log('   ✅ Candidate upgraded successfully.');
    }

    // 7. Apply to job & check priority
    console.log('7. Apply & check Priority in HR Dashboard...');
    
    // We need a dummy candidate (non-premium) to apply first
    const dummyEmail = 'dummy_can@example.com';
    await pool.query('DELETE FROM candidates WHERE email = $1', [dummyEmail]);
    const dummyAuth = await axios.post(`${baseURL}/auth/candidate/register`, {
      email: dummyEmail,
      password: 'password123',
      first_name: 'Regular',
      last_name: 'Guy'
    });
    const dummyLogin = await axios.post(`${baseURL}/auth/candidate/login`, {
      email: dummyEmail,
      password: 'password123'
    });
    const dummyToken = dummyLogin.data.data.accessToken;
    const dumDbRes = await pool.query('SELECT id FROM candidates WHERE email = $1', [dummyEmail]);
    const dumId = dumDbRes.rows[0].id;
    await pool.query('INSERT INTO candidate_profiles (candidate_id, full_name) VALUES ($1, $2)', [dumId, 'Regular Guy']);
    
    await axios.post(`${baseURL}/candidate/applications/jobs/${job1Id}/apply`, {}, { headers: { Authorization: `Bearer ${dummyToken}` }});
    await axios.post(`${baseURL}/candidate/applications/jobs/${job1Id}/apply`, {}, { headers: { Authorization: `Bearer ${candidateToken}` }});

    // Check HR candidates list
    const candidatesRes = await axios.get(`${baseURL}/dashboard/candidates`, { headers: { Authorization: `Bearer ${hrToken}` }});
    const candidates = candidatesRes.data.data;
    
    if (candidates[0].first_name === 'John Premium' && candidates[0].subscription_tier === 'premium') {
      console.log('   ✅ Premium candidate is sorted at the top!');
    } else {
      console.error('   ❌ Premium candidate is not at the top.');
    }

    console.log('\n--- ALL PREMIUM TESTS PASSED ---');

  } catch (err) {
    console.error('TEST FAILED:', err.response ? err.response.data : err.message);
  } finally {
    await pool.end();
  }
}

runTests();

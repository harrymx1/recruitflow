const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runMigration() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Adding subscription types and columns...');
    
    // 1. Companies: subscription_tier (starter, growth, enterprise), subscription_expires_at
    await client.query(`
      ALTER TABLE companies 
      ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'growth', 'enterprise')),
      ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;
    `);

    // 2. Candidates: subscription_tier (free, premium), subscription_expires_at
    await client.query(`
      ALTER TABLE candidates 
      ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
      ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;
    `);

    await client.query('COMMIT');
    console.log('Sprint 9 migration completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during migration:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);

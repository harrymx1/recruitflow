const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runMigration() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Creating activity_logs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        actor_type VARCHAR(50) NOT NULL CHECK (actor_type IN ('company_member', 'candidate', 'system')),
        actor_id UUID,
        action_type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add an index to speed up activity log queries for an application
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_activity_logs_application_id ON activity_logs(application_id);
    `);

    await client.query('COMMIT');
    console.log('Sprint 8 migration completed successfully.');
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

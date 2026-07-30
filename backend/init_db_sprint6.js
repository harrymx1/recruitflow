require('dotenv').config();
const db = require('./src/config/db');

async function migrate() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // 1. Create candidate_tags table
    const createTagsQuery = `
      CREATE TABLE IF NOT EXISTS candidate_tags (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL,
        color VARCHAR(20) DEFAULT '#0d9488',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(company_id, name)
      );
    `;
    await client.query(createTagsQuery);
    console.log('Created candidate_tags table');

    // 2. Create application_tags table
    const createAppTagsQuery = `
      CREATE TABLE IF NOT EXISTS application_tags (
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES candidate_tags(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (application_id, tag_id)
      );
    `;
    await client.query(createAppTagsQuery);
    console.log('Created application_tags table');

    // 3. Create interviews table
    const createInterviewsQuery = `
      CREATE TABLE IF NOT EXISTS interviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
        duration_minutes INTEGER DEFAULT 60,
        meeting_link TEXT,
        location TEXT,
        status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createInterviewsQuery);
    console.log('Created interviews table');

    await client.query('COMMIT');
    console.log('Sprint 6 migration completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrate();

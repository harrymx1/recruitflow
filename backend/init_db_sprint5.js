require('dotenv').config();
const db = require('./src/config/db');

async function migrate() {
  try {
    // 1. Add resume_url and source to applications table if not exist
    const addColumnsQuery = `
      ALTER TABLE applications 
      ADD COLUMN IF NOT EXISTS resume_url TEXT,
      ADD COLUMN IF NOT EXISTS source VARCHAR(100);
    `;
    await db.query(addColumnsQuery);
    console.log('Added resume_url and source to applications');

    // 2. Create application_answers table
    const createAnswersQuery = `
      CREATE TABLE IF NOT EXISTS application_answers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        question_id UUID NOT NULL REFERENCES job_custom_questions(id) ON DELETE CASCADE,
        answer_text TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(createAnswersQuery);
    console.log('Created application_answers table');

    // 3. Ensure candidate_documents are accessible by applications when candidate deletes them?
    // PRD says "Menyimpan snapshot CV yang digunakan saat melamar".
    // Actually, by copying the `file_url` into `resume_url`, we are keeping a snapshot
    // of the link, as long as we don't physically delete the file. (We don't physically delete local files in Sprint 4 removeDocument, we just delete the db record).

    console.log('Sprint 5 migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();

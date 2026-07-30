require('dotenv').config();
const db = require('./src/config/db');

async function seed() {
  const jobId = 'd19387a7-ab31-4e64-a214-1c99e2719e4f';

  try {
    const { rows: stages } = await db.query('SELECT id FROM job_pipeline_stages WHERE job_id = $1', [jobId]);
    if (stages.length === 0) {
      console.log('No pipeline stages found for job', jobId);
      process.exit(1);
    }

    const mockUsers = [
      { email: 'andi_pipe@example.com', name: 'Andi Setiawan', headline: 'Frontend Dev' },
      { email: 'budi_pipe@example.com', name: 'Budi Santoso', headline: 'Backend Dev' },
      { email: 'cindy_pipe@example.com', name: 'Cindy Larasati', headline: 'Fullstack Dev' },
      { email: 'doni_pipe@example.com', name: 'Doni Pratama', headline: 'Mobile Dev' },
      { email: 'erina_pipe@example.com', name: 'Erina Putri', headline: 'UI/UX Designer' }
    ];

    for (const u of mockUsers) {
      let candId;
      try {
        const { rows: cand } = await db.query(
          'INSERT INTO candidates (email, password_hash) VALUES ($1, $2) RETURNING id',
          [u.email, 'hashed_password_mock']
        );
        candId = cand[0].id;
        
        await db.query(
          'INSERT INTO candidate_profiles (candidate_id, full_name, headline) VALUES ($1, $2, $3)',
          [candId, u.name, u.headline]
        );
      } catch(e) {
        // if exists, just select it
        const { rows: c } = await db.query('SELECT id FROM candidates WHERE email = $1', [u.email]);
        candId = c[0].id;
      }

      const randomStage = stages[Math.floor(Math.random() * stages.length)].id;

      try {
        await db.query(
          'INSERT INTO applications (job_id, candidate_id, current_stage_id, status) VALUES ($1, $2, $3, $4)',
          [jobId, candId, randomStage, 'active']
        );
      } catch(e) {
        // Ignore duplicate application constraint
      }
    }

    await db.query('UPDATE jobs SET applicants_count = 5 WHERE id = $1', [jobId]);

    console.log('Successfully seeded 5 applications for job', jobId);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

seed();

require('dotenv').config();
const db = require('./src/config/db');

const query = `
CREATE TABLE IF NOT EXISTS candidate_profiles (
  candidate_id UUID PRIMARY KEY REFERENCES candidates(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  headline VARCHAR(255)
);
`;

db.query(query)
  .then(() => console.log('candidate_profiles created successfully'))
  .catch(console.error)
  .finally(() => process.exit(0));

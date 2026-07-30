const {Pool}=require('pg');
require('dotenv').config({path: './.env'});
const pool = new Pool({connectionString:process.env.DATABASE_URL});
pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['candidates']).then(res => {
    console.log('candidates:', res.rows.map(r => r.column_name));
});
pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['candidate_profiles']).then(res => {
    console.log('candidate_profiles:', res.rows.map(r => r.column_name));
    pool.end();
});

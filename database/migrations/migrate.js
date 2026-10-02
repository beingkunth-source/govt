/* ==========================================================================
   SHIKSHA SETU - DATABASE MIGRATION RUNNER
   ========================================================================== */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });

const isSupabase = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase');
const poolConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: isSupabase ? { rejectUnauthorized: false } : false
} : {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'shiksha_setu_db',
  user: process.env.DB_USER || 'shiksha_user',
  password: process.env.DB_PASSWORD
};

const pool = new Pool(poolConfig);

async function runMigrations() {
  console.log('🔄 Running Shiksha Setu database migrations...');

  try {
    const schemaPath = path.join(__dirname, '../schema/001_initial.sql');
    const sql = fs.readFileSync(schemaPath, 'utf-8');

    await pool.query(sql);
    console.log('✅ Schema 001_initial.sql applied successfully.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();

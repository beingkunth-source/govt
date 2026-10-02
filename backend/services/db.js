/* ==========================================================================
   SHIKSHA SETU - POSTGRESQL CONNECTION POOL
   ========================================================================== */

const { Pool } = require('pg');

const isSupabase = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase');

const poolConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: isSupabase ? { rejectUnauthorized: false } : false
} : {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'shiksha_setu_db',
  user:     process.env.DB_USER     || 'shiksha_user',
  password: process.env.DB_PASSWORD,
};

const pool = new Pool({
  ...poolConfig,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

/**
 * Execute a parameterized query.
 * @param {string} text - SQL query string
 * @param {Array}  params - Query parameters
 * @returns {Promise<QueryResult>}
 */
const query = (text, params) => pool.query(text, params);

/**
 * Get a dedicated client for transactions.
 */
const getClient = () => pool.connect();

module.exports = { query, getClient, pool };

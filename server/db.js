import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') || process.env.PGSSL === 'false'
        ? false
        : { rejectUnauthorized: false }
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '242331',
      database: process.env.PGDATABASE || 'meridian_retention_db',
    };

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('[PostgreSQL Error] Unexpected client error:', err.message);
});

export async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() AS now, current_database() AS db');
    client.release();
    console.log(`[PostgreSQL] Connected successfully to database: "${res.rows[0].db}" at ${res.rows[0].now}`);
    return true;
  } catch (err) {
    console.error('[PostgreSQL] Connection failed:', err.message);
    return false;
  }
}

export default pool;


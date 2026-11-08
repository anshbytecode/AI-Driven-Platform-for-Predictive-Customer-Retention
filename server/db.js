import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

// Auto-configure SSL for cloud providers
function getSslConfig() {
  if (process.env.PGSSL === 'true') return { rejectUnauthorized: false };
  if (process.env.PGSSL === 'false') return false;
  if (!process.env.DATABASE_URL) return false;
  
  const url = process.env.DATABASE_URL;
  if (url.includes('localhost') || url.includes('127.0.0.1')) return false;
  // Render internal hosts (e.g. dpg-xxxx-a) run on private network without SSL
  if (url.includes('-a/') || url.includes('-a:5432/')) return false;
  
  // External cloud databases (Neon, Supabase, Render External URL) require SSL
  if (url.includes('render.com') || url.includes('neon.tech') || url.includes('supabase') || url.includes('sslmode=require')) {
    return { rejectUnauthorized: false };
  }

  return false;
}

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: getSslConfig()
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


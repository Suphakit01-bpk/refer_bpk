import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
});

// Add connection test
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('ข้อมูลการ Query:', { 
      text, 
      duration: `${duration}ms`, 
      จำนวนแถว: res.rowCount 
    });
    return res;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดกับฐานข้อมูล:', error);
    throw error;
  }
}

// เพิ่มฟังก์ชันทดสอบการเชื่อมต่อ
export async function db_connect() {
  try {
    const client = await pool.connect();
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ');
    client.release();
    return true;
  } catch (err) {
    console.error('❌ ไม่สามารถเชื่อมต่อฐานข้อมูลได้:', err);
    return false;
  }
}

export default pool;

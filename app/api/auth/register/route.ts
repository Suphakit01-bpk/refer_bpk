import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query, db_connect } from '@/lib/db_connect';
import { logger } from '@/utils/logger';

export async function POST(req: Request) {
  let userData: any;

  try {
    userData = await req.json();
    
    logger.info('Register', { username: userData.username });

    // ตรวจสอบการเชื่อมต่อ
    const isConnected = await db_connect();
    if (!isConnected) {
      logger.error('Database connection failed', { username: userData.username });
      throw new Error('ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้');
    }

    // ตรวจสอบ username ซ้ำ
    const checkUser = await query(
      'SELECT username FROM users WHERE username = $1',
      [userData.username]
    );

    if (checkUser && checkUser.rowCount && checkUser.rowCount > 0) {
      logger.error('Username exists', { username: userData.username });
      
      return NextResponse.json(
        { 
          success: false, 
          message: '❌ ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่อผู้ใช้อื่น'
        },
        { status: 400 }
      );
    }

    logger.info('Saving user data', { username: userData.username });
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // บันทึกผู้ใช้ใหม่
    const result = await query(
      `INSERT INTO users (
        username, password, hospital_at, first_name, last_name,
        role, gender, created_date, created_time, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [
        userData.username,
        hashedPassword,
        userData.hospital_at,
        userData.first_name,
        userData.last_name,
        userData.role,
        userData.gender,
        userData.created_date,
        userData.created_time,
        userData.status
      ]
    );

    if (result && result.rowCount === 1) {
      logger.action('Register successful', `${userData.username}(${userData.role})`);

      return NextResponse.json({ 
        success: true, 
        message: 'ลงทะเบียนสำเร็จ',
        userId: result.rows[0].id 
      });
    }

    throw new Error('ไม่สามารถบันทึกข้อมูลผู้ใช้ได้');

  } catch (error: any) {
    logger.error('การลงทะเบียนล้มเหลว', {
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
      details: userData ? {  // เช็คว่ามี userData ก่อนใช้
        username: userData.username,
        hospital: userData.hospital_at
      } : 'No user data available'
    });

    let errorMessage = 'เกิดข้อผิดพลาดในการลงทะเบียน';
    if (error.code === '23505') {
      errorMessage = '❌ ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่อผู้ใช้อื่น';
    } else if (error.code === '23502') {
      errorMessage = '❌ กรุณากรอกข้อมูลให้ครบถ้วน';
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: error.code ? 400 : 500 }
    );
  }
}

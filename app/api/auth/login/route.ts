import { query, db_connect } from '@/lib/db_connect';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { logger } from '@/utils/logger';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const headersList = await headers(); // Add await here
  const userAgent = headersList.get('user-agent') || 'Unknown';
  const ip = headersList.get('x-forwarded-for') || 
             headersList.get('x-real-ip') || 
             'Unknown';

  try {
    const { username, password } = await request.json();
    
    logger.info('Login attempt', { 
      username,
      ip_address: ip,
      user_agent: userAgent
    });

    // ตรวจสอบการเชื่อมต่อก่อนดำเนินการ
    const isConnected = await db_connect();
    if (!isConnected) {
      logger.error('Database connection failed', { 
        username,
        ip_address: ip,
        status_code: 503
      });
      return NextResponse.json(
        { error: 'ขออภัย ระบบไม่สามารถเชื่อมต่อฐานข้อมูลได้ในขณะนี้ กรุณาลองใหม่ภายหลัง' },
        { status: 503 }
      );
    }

    const result = await query(
      'SELECT * FROM users WHERE username = $1 AND status = $2',
      [username, 'active']
    );

    if (!result || result.rows.length === 0) {
      logger.error('User not found', {
        username,
        ip_address: ip,
        status_code: 401,
        error_type: 'USER_NOT_FOUND'
      });
      return NextResponse.json(
        { 
          error: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ',
          error_type: 'USER_NOT_FOUND'
        },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      logger.error('Invalid password', {
        username,
        ip_address: ip,
        status_code: 401,
        error_type: 'INVALID_PASSWORD'
      });
      return NextResponse.json(
        { 
          error: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง',
          error_type: 'INVALID_PASSWORD'
        },
        { status: 401 }
      );
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Log successful login with status and IP
    logger.action('Login successful', username, {
      ip_address: ip,
      status_code: 200,
      user_agent: userAgent
    });

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'เข้าสู่ระบบสำเร็จ'
    });
  } catch (error: any) {
    logger.error('Unknown error during login', {
      error: error.message,
      ip_address: ip,
      status_code: 500,
      user_agent: userAgent
    });
    return NextResponse.json(
      { 
        error: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ',
        error_type: 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}

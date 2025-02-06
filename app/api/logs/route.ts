import { NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = new Date();
    const year = searchParams.get('year') || date.getFullYear().toString();
    const month = searchParams.get('month') || (date.getMonth() + 1).toString().padStart(2, '0');
    const day = searchParams.get('day') || date.getDate().toString().padStart(2, '0');
    
    const logs = await logger.getLogs(year, month, day);

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error reading logs:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอ่านไฟล์ log' },
      { status: 500 }
    );
  }
}

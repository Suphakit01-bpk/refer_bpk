import { query, db_connect } from '@/lib/db_connect';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test connection first
    const isConnected = await db_connect();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Could not connect to database' },
        { status: 500 }
      );
    }

    const result = await query('SELECT NOW()');
    return NextResponse.json({ 
      success: true,
      data: result.rows,
      message: 'Database connected successfully' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Database error', 
      message: error.message 
    }, { status: 500 });
  }
}

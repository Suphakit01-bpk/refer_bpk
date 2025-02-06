import { query } from '@/lib/db_connect';
import { NextResponse } from 'next/server';

// GET - Fetch all refers
export async function GET() {
  try {
    const result = await query('SELECT * FROM refers ORDER BY created_at DESC');
    return NextResponse.json({ data: result.rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new refer
export async function POST(request: Request) {
  try {
    const { hn, patient_name, diagnosis } = await request.json();
    
    const result = await query(
      'INSERT INTO refers (hn, patient_name, diagnosis) VALUES ($1, $2, $3) RETURNING *',
      [hn, patient_name, diagnosis]
    );
    
    return NextResponse.json({ data: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

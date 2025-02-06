import { query } from '@/lib/db_connect';
import { NextResponse } from 'next/server';

// GET - Fetch single refer
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('SELECT * FROM refers WHERE id = $1', [params.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Refer not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: result.rows[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update refer
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { hn, patient_name, diagnosis } = await request.json();
    
    const result = await query(
      'UPDATE refers SET hn = $1, patient_name = $2, diagnosis = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [hn, patient_name, diagnosis, params.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Refer not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: result.rows[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete refer
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('DELETE FROM refers WHERE id = $1 RETURNING *', [params.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Refer not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Refer deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

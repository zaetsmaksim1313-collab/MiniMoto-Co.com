import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { rows } = await sql`SELECT * FROM products ORDER BY name ASC`;
        return NextResponse.json({ success: true, count: rows.length, products: rows });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message, stack: e.stack });
    }
}

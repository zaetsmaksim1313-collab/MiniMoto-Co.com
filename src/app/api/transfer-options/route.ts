import { NextResponse } from 'next/server';
import { sql as db } from '@/lib/db';

export async function GET() {
    try {
        const ubQuery = await db.query("SELECT id, options FROM products WHERE name ILIKE '%Ultra Bee%' LIMIT 1");
        const ub = ubQuery.rows[0];
        
        if (!ub) {
            return NextResponse.json({ success: false, message: 'Ultra Bee not found' });
        }
        
        const lbxQuery = await db.query("SELECT id FROM products WHERE name ILIKE '%LBX%' LIMIT 1");
        const lbx = lbxQuery.rows[0];
        
        if (!lbx) {
            return NextResponse.json({ success: false, message: 'LBX not found' });
        }
        
        await db.query("UPDATE products SET options = $1 WHERE id = $2", [JSON.stringify(ub.options), lbx.id]);
        
        return NextResponse.json({ success: true, message: 'Transferred options from Ultra Bee to LBX' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}

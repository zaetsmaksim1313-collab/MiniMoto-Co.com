import { NextResponse } from 'next/server';
import { ensureDb } from '@/lib/products';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
    try {
        await ensureDb();
        const { images } = await req.json();

        if (!Array.isArray(images)) {
            return NextResponse.json({ success: false, error: 'Invalid images array' }, { status: 400 });
        }

        await sql`
            INSERT INTO site_settings (key, value)
            VALUES ('make_it_yours_images', ${JSON.stringify(images)}::jsonb)
            ON CONFLICT (key) DO UPDATE
            SET value = ${JSON.stringify(images)}::jsonb
        `;

        revalidatePath('/', 'layout');
        revalidatePath('/admin/settings');

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("API Save Showcase Error:", e);
        return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
    }
}

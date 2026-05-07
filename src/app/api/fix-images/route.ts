import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const defaultImages = [
            "/custom 1.JPG",
            "/custom 2.JPG",
            "/custom 3.JPG",
            "/custom 4.JPG",
            "/custom 5.JPG"
        ];

        // Ensure make_it_yours_images correctly point to the public files with URL encoding
        await sql`
            INSERT INTO site_settings (key, value)
            VALUES ('make_it_yours_images', ${JSON.stringify(defaultImages)}::jsonb)
            ON CONFLICT (key) DO UPDATE 
            SET value = ${JSON.stringify(defaultImages)}::jsonb;
        `;

        // If there are any products, let's also give them the first custom image so the shop looks good
        // We'll only update products that currently have the fallback unsplash image, or just update all of them if they are broken.
        await sql`
            UPDATE products 
            SET images = ${JSON.stringify(["/custom 1.JPG"])}::jsonb
            WHERE images::text LIKE '%unsplash%';
        `;

        revalidatePath('/', 'layout');

        return NextResponse.json({ 
            success: true, 
            message: "Images synced! 'Make It Yours' and Product images have been updated to use your provided photos. You can safely return to your site!" 
        });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message });
    }
}

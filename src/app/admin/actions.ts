'use server';

import { getProductById, ensureDb } from '@/lib/products';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export async function addProduct(formData: FormData) {
    try {
        await ensureDb();
        
        const id = (formData.get('id') as string) || Math.random().toString(36).substr(2, 9);
        const name = formData.get('name') as string;
        const price = Number(formData.get('price'));
        const compareAtPrice = formData.get('compareAtPrice') ? Number(formData.get('compareAtPrice')) : null;
        const description = formData.get('description') as string;
        
        const imagesRaw = formData.get('images') as string;
        let images: string[] = ["https://images.unsplash.com/photo-1558981403-c5f94bbde586"];
        if (imagesRaw) {
            try {
                images = JSON.parse(imagesRaw);
            } catch {
                images = imagesRaw.split(',').map(img => img.trim());
            }
        }
        
        const category = formData.get('category') as string;
        const optionsRaw = formData.get('options') as string;
        const options = optionsRaw ? JSON.parse(optionsRaw) : [];
        const status = (formData.get('status') as string) || 'Active';

        await sql`
            INSERT INTO products (id, name, price, compareAtPrice, description, images, category, options, status)
            VALUES (${id}, ${name}, ${price}, ${compareAtPrice}, ${description}, ${JSON.stringify(images)}, ${category}, ${JSON.stringify(options)}, ${status})
        `;
        revalidatePath('/', 'layout');
        revalidatePath('/admin/products');
        revalidatePath(`/admin/products/${id}`);
        revalidatePath(`/products/${id}`);
        return { success: true };
    } catch (e: any) {
        console.error("Add Product Error:", e);
        return { success: false, error: e.message };
    }
}

export async function deleteProduct(id: string) {
    await ensureDb();
    await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath('/', 'layout');
    revalidatePath('/admin/products');
}

export async function updateProduct(formData: FormData) {
    await ensureDb();
    const id = formData.get('id') as string;
    
    const existing = await getProductById(id);
    if (!existing) return { success: false, error: 'Product not found' };

    const name = formData.get('name') as string;
    const price = Number(formData.get('price'));
    const compareAtPrice = formData.get('compareAtPrice') ? Number(formData.get('compareAtPrice')) : null;
    const description = formData.get('description') as string;
    
    const imagesRaw = formData.get('images') as string;
    let images: string[] = existing.images;
    if (imagesRaw) {
        try {
            images = JSON.parse(imagesRaw);
        } catch {
            images = imagesRaw.split(',').map(img => img.trim());
        }
    }
    
    const category = formData.get('category') as string;
    const optionsRaw = formData.get('options') as string;
    const options = optionsRaw ? JSON.parse(optionsRaw) : existing.options;
    const status = (formData.get('status') as string) || existing.status;

    try {
        await sql`
            UPDATE products
            SET name = ${name}, price = ${price}, compareAtPrice = ${compareAtPrice}, description = ${description}, images = ${JSON.stringify(images)}, category = ${category}, options = ${JSON.stringify(options)}, status = ${status}
            WHERE id = ${id}
        `;
        revalidatePath('/', 'layout');
        revalidatePath('/admin/products');
        revalidatePath(`/admin/products/${id}`);
        revalidatePath(`/products/${id}`);
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateMakeItYoursImages(images: string[]) {
    await ensureDb();
    try {
        await sql`
            UPDATE site_settings 
            SET value = ${JSON.stringify(images)}::jsonb 
            WHERE key = 'make_it_yours_images'
        `;
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

import { sql } from '@vercel/postgres';

export interface ProductOption {
    name: string;
    type?: 'dropdown' | 'selection' | 'textbox';
    values: {
        value: string;
        priceModifier?: number;
    }[];
}

export interface Product {
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    description: string;
    images: string[];
    category: string;
    options: ProductOption[];
    status: 'Active' | 'Draft' | 'Archived';
}

export async function ensureDb() {
    await sql`
        CREATE TABLE IF NOT EXISTS products (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price NUMERIC(10,2) NOT NULL,
            compareAtPrice NUMERIC(10,2),
            description TEXT,
            images JSONB,
            category VARCHAR(255),
            options JSONB,
            status VARCHAR(50)
        );
    `;
}

export async function getProducts(): Promise<Product[]> {
    try {
        await ensureDb();
        const { rows } = await sql`SELECT * FROM products ORDER BY name ASC`;
        return rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            price: Number(row.price),
            compareAtPrice: row.compareatprice ? Number(row.compareatprice) : undefined,
            description: row.description,
            images: row.images,
            category: row.category,
            options: row.options,
            status: row.status,
        }));
    } catch (e) {
        console.error("Database not set up or failed to fetch products:", e);
        return [];
    }
}

export async function getProductById(id: string): Promise<Product | undefined> {
    try {
        await ensureDb();
        const { rows } = await sql`SELECT * FROM products WHERE id = ${id}`;
        if (rows.length === 0) return undefined;
        const row = rows[0];
        return {
            id: row.id,
            name: row.name,
            price: Number(row.price),
            compareAtPrice: row.compareatprice ? Number(row.compareatprice) : undefined,
            description: row.description,
            images: row.images,
            category: row.category,
            options: row.options,
            status: row.status,
        };
    } catch (e) {
        return undefined;
    }
}

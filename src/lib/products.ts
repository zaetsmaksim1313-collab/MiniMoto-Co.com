import fs from 'fs';
import path from 'path';

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

import productsData from '../data/products.json';

const productsFilePath = path.join(process.cwd(), 'src/data/products.json');

export async function getProducts(): Promise<Product[]> {
    if (process.env.NODE_ENV === 'development') {
        try {
            const fileData = fs.readFileSync(productsFilePath, 'utf8');
            return JSON.parse(fileData);
        } catch (e) {
            return productsData as unknown as Product[];
        }
    }
    return productsData as unknown as Product[];
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const products = await getProducts();
    return products.find(p => p.id === id);
}

export async function saveProducts(products: Product[]): Promise<void> {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
}

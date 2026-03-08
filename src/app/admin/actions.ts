'use server';

import { getProducts, saveProducts, Product } from '@/lib/products';
import { revalidatePath } from 'next/cache';

export async function addProduct(formData: FormData) {
    const products = await getProducts();

    const newProduct: Product = {
        id: formData.get('id') as string || Math.random().toString(36).substr(2, 9),
        name: formData.get('name') as string,
        price: Number(formData.get('price')),
        compareAtPrice: formData.get('compareAtPrice') ? Number(formData.get('compareAtPrice')) : undefined,
        description: formData.get('description') as string,
        images: formData.get('images') ? (formData.get('images') as string).split(',').map(img => img.trim()) : ["https://images.unsplash.com/photo-1558981403-c5f94bbde586?auto=format&fit=crop&q=80&w=600"],
        category: formData.get('category') as string,
        options: JSON.parse(formData.get('options') as string || '[]'),
        status: (formData.get('status') as any) || 'Active'
    };

    products.push(newProduct);
    await saveProducts(products);

    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
}

export async function deleteProduct(id: string) {
    const products = await getProducts();
    const filtered = products.filter(p => p.id !== id);
    await saveProducts(filtered);
    revalidatePath('/products');
    revalidatePath('/');
}

export async function updateProduct(formData: FormData) {
    const products = await getProducts();
    const id = formData.get('id') as string;
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return { success: false, error: 'Product not found' };

    const updatedProduct: Product = {
        ...products[index],
        name: formData.get('name') as string,
        price: Number(formData.get('price')),
        compareAtPrice: formData.get('compareAtPrice') ? Number(formData.get('compareAtPrice')) : undefined,
        description: formData.get('description') as string,
        images: formData.get('images') ? (formData.get('images') as string).split(',').map(img => img.trim()) : products[index].images,
        category: formData.get('category') as string,
        options: JSON.parse(formData.get('options') as string || '[]'),
        status: (formData.get('status') as any) || products[index].status
    };

    products[index] = updatedProduct;
    await saveProducts(products);

    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    revalidatePath('/');
    return { success: true };
}

'use server';

import { saveOrder, Order, getOrders } from '@/lib/orders';
import { revalidatePath } from 'next/cache';

export async function placeOrder(orderData: Omit<Order, 'id' | 'date' | 'status' | 'paymentStatus'>) {
    const newOrder: Order = {
        ...orderData,
        id: `#${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        status: 'Pending',
        paymentStatus: 'Paid' // Simulation of successful payment
    };

    await saveOrder(newOrder);
    revalidatePath('/admin/orders');
    return { success: true, orderId: newOrder.id };
}

export async function fetchAllOrders() {
    return await getOrders();
}

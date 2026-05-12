'use server';

import { saveOrder, Order, getOrders } from '@/lib/orders';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

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

export async function fetchAllOrders(): Promise<Order[]> {
    if (!process.env.STRIPE_SECRET_KEY) {
        return await getOrders();
    }
    
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16' as any,
        });

        // Fetch recent checkout sessions
        const sessions = await stripe.checkout.sessions.list({
            limit: 50,
            expand: ['data.line_items'],
        });

        const stripeOrders: Order[] = sessions.data.map((session) => {
            const customerDetails = session.customer_details;
            
            let firstName = 'Guest';
            let lastName = '';
            if (customerDetails?.name) {
                const parts = customerDetails.name.split(' ');
                firstName = parts[0] || 'Guest';
                lastName = parts.slice(1).join(' ');
            }
            
            let customerMetadata: any = {};
            if (session.metadata?.customerInfo) {
                try {
                    customerMetadata = JSON.parse(session.metadata.customerInfo);
                } catch (e) {}
            }

            return {
                id: session.id.replace('cs_test_', '').replace('cs_live_', '').substring(0, 8).toUpperCase(),
                date: new Date(session.created * 1000).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                customer: {
                    firstName: customerMetadata.firstName || firstName,
                    lastName: customerMetadata.lastName || lastName,
                    email: customerDetails?.email || customerMetadata.email || 'No email',
                    address: customerDetails?.address?.line1 || customerMetadata.address || '',
                    city: customerDetails?.address?.city || customerMetadata.city || '',
                    zipCode: customerDetails?.address?.postal_code || customerMetadata.zipCode || ''
                },
                items: session.line_items?.data.map((item) => ({
                    productId: item.price?.product?.toString() || item.id,
                    name: item.description || 'Product',
                    price: (item.amount_total / 100) / (item.quantity || 1),
                    quantity: item.quantity || 1,
                    selectedOptions: {} 
                })) || [],
                total: (session.amount_total || 0) / 100,
                status: session.status === 'complete' ? 'Pending' : 'Cancelled',
                paymentStatus: session.payment_status === 'paid' ? 'Paid' : 'Unpaid'
            };
        });
        
        // Also get any mock/local JSON orders
        const localOrders = await getOrders();
        
        return [...stripeOrders, ...localOrders];
    } catch (err) {
        console.error("Failed to fetch Stripe orders", err);
        return await getOrders();
    }
}

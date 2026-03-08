import fs from 'fs';
import path from 'path';

export interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    selectedOptions: { [key: string]: string };
}

export interface Order {
    id: string;
    date: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        address: string;
        city: string;
        zipCode: string;
    };
    items: OrderItem[];
    total: number;
    status: 'Pending' | 'Paid' | 'Fulfilled' | 'Cancelled';
    paymentStatus: 'Unpaid' | 'Paid' | 'Refunded';
}

const ordersFilePath = path.join(process.cwd(), 'src/data/orders.json');

export async function getOrders(): Promise<Order[]> {
    if (!fs.existsSync(ordersFilePath)) {
        return [];
    }
    const fileData = fs.readFileSync(ordersFilePath, 'utf8');
    return JSON.parse(fileData);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
    const orders = await getOrders();
    return orders.find(o => o.id === id);
}

export async function saveOrder(order: Order): Promise<void> {
    const orders = await getOrders();
    orders.push(order);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
}

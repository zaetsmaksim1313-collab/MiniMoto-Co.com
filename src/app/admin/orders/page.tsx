'use client';

import { useState, useEffect } from 'react';
import { fetchAllOrders } from '../order-actions';
import { Order } from '@/lib/orders';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllOrders().then(data => {
            setOrders(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading orders...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 className="admin-title" style={{ margin: 0 }}>Orders</h1>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-admin">Export</button>
                    <button className="btn-admin btn-admin-primary">Create order</button>
                </div>
            </div>

            <div className="admin-card" style={{ padding: 0 }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #ebebeb', display: 'flex', gap: '12px' }}>
                    <button className="btn-admin" style={{ background: '#f1f1f1', border: 'none' }}>All</button>
                    <button className="btn-admin" style={{ border: 'none' }}>Unfulfilled</button>
                    <button className="btn-admin" style={{ border: 'none' }}>Unpaid</button>
                    <button className="btn-admin" style={{ border: 'none' }}>Open</button>
                    <button className="btn-admin" style={{ border: 'none' }}>Archived</button>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}><input type="checkbox" /></th>
                            <th>Order</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Payment status</th>
                            <th>Fulfillment status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No orders found</td>
                            </tr>
                        ) : (
                            orders.map(o => (
                                <tr key={o.id}>
                                    <td><input type="checkbox" /></td>
                                    <td style={{ fontWeight: '600' }}>{o.id}</td>
                                    <td style={{ fontSize: '0.9rem', color: '#6d6d6d' }}>{o.date}</td>
                                    <td style={{ fontSize: '0.9rem' }}>{o.customer.firstName} {o.customer.lastName}</td>
                                    <td style={{ fontSize: '0.9rem' }}>${o.total.toFixed(2)}</td>
                                    <td>
                                        <span style={{ fontSize: '0.8rem', background: o.paymentStatus === 'Paid' ? '#e3f9ee' : '#fff4e5', color: o.paymentStatus === 'Paid' ? '#007f5f' : '#b45400', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
                                            {o.paymentStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.8rem', background: '#f1f1f1', color: '#616161', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
                                            {o.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { fetchAllOrders } from '../order-actions';
import { Order } from '@/lib/orders';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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
                            orders.map(o => {
                                const isExpanded = expandedOrderId === o.id;
                                return (
                                    <React.Fragment key={o.id}>
                                        <tr 
                                            style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                                            onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                                        >
                                            <td><input type="checkbox" onClick={(e) => e.stopPropagation()} /></td>
                                            <td style={{ fontWeight: '600' }}>
                                                <span style={{ marginRight: '8px', color: '#999', fontSize: '0.8rem' }}>
                                                    {isExpanded ? '▼' : '▶'}
                                                </span>
                                                {o.id}
                                            </td>
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
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan={7} style={{ background: '#fdfdfd', padding: '20px 24px', borderBottom: '1px solid #ebebeb' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                                        <div>
                                                            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Items ({o.items.length})</h4>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                                {o.items.map((item, idx) => (
                                                                    <div key={idx} style={{ padding: '12px', border: '1px solid #eaeaea', borderRadius: '6px', background: '#fff' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>
                                                                            <span>{item.name} <span style={{ color: '#666', fontWeight: 'normal' }}>x{item.quantity}</span></span>
                                                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                                        </div>
                                                                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '6px', borderTop: '1px solid #f4f4f4', paddingTop: '6px' }}>
                                                                                {Object.entries(item.selectedOptions).map(([key, val]) => {
                                                                                    if (key === 'design_json') return null; // hide raw JSON
                                                                                    if (key === 'Decal Image') {
                                                                                        return (
                                                                                            <div key={key} style={{ marginTop: '8px' }}>
                                                                                                <strong>{key}:</strong>
                                                                                                <div style={{ marginTop: '6px' }}>
                                                                                                    <img 
                                                                                                        src={val} 
                                                                                                        alt="Custom Decal Design" 
                                                                                                        style={{ maxWidth: '200px', border: '1px solid #ddd', borderRadius: '4px', background: '#f9f9f9', display: 'block', marginBottom: '8px' }} 
                                                                                                    />
                                                                                                    <a 
                                                                                                        href={val} 
                                                                                                        target="_blank" 
                                                                                                        rel="noopener noreferrer" 
                                                                                                        className="btn-admin"
                                                                                                        style={{ textDecoration: 'none', display: 'inline-block', padding: '6px 12px', fontSize: '0.75rem', background: '#000', color: '#fff', borderRadius: '4px', fontWeight: '600' }}
                                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                                    >
                                                                                                        🖨️ View & Print Full-Size Decal
                                                                                                    </a>
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                    return (
                                                                                        <div key={key} style={{ marginBottom: '2px' }}>
                                                                                            <strong>{key}:</strong> {val}
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shipping & Customer Info</h4>
                                                            <div style={{ padding: '16px', border: '1px solid #eaeaea', borderRadius: '6px', background: '#fff', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                                                <div><strong>Name:</strong> {o.customer.firstName} {o.customer.lastName}</div>
                                                                <div><strong>Email:</strong> {o.customer.email}</div>
                                                                <div style={{ marginTop: '8px' }}>
                                                                    <strong>Address:</strong><br />
                                                                    {o.customer.address}<br />
                                                                    {o.customer.city}, {o.customer.zipCode}<br />
                                                                    {o.customer.country || 'US'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { deleteProduct } from '../actions';
import Link from 'next/link';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        const res = await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 className="admin-title" style={{ margin: 0 }}>Products</h1>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-admin">Export</button>
                    <button className="btn-admin">Import</button>
                    <Link href="/admin/products/new" className="btn-admin btn-admin-primary">Add product</Link>
                </div>
            </div>

            <div className="admin-card" style={{ padding: 0 }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #ebebeb', display: 'flex', gap: '12px' }}>
                    <button className="btn-admin" style={{ background: '#f1f1f1', border: 'none' }}>All</button>
                    <button className="btn-admin" style={{ border: 'none' }}>Active</button>
                    <button className="btn-admin" style={{ border: 'none' }}>Draft</button>
                    <button className="btn-admin" style={{ border: 'none' }}>Archived</button>
                    <button className="btn-admin" style={{ border: 'none' }}>+</button>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}><input type="checkbox" /></th>
                            <th style={{ width: '60px' }}></th>
                            <th>Product</th>
                            <th>Status</th>
                            <th>Inventory</th>
                            <th>Category</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td><input type="checkbox" /></td>
                                <td>
                                    <div style={{ width: '40px', height: '40px', background: '#f1f1f1', borderRadius: '4px', overflow: 'hidden' }}>
                                        {p.images?.[0] && <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                    </div>
                                </td>
                                <td>
                                    <Link href={`/admin/products/${p.id}`} style={{ color: '#1a1a1a', fontWeight: '600', textDecoration: 'none' }}>
                                        {p.name}
                                    </Link>
                                </td>
                                <td>
                                    <span className={`badge badge-${(p.status || 'Active').toLowerCase()}`}>
                                        {p.status || 'Active'}
                                    </span>
                                </td>
                                <td style={{ color: '#6d6d6d', fontSize: '0.9rem' }}>
                                    Inventory not tracked
                                </td>
                                <td style={{ color: '#6d6d6d', fontSize: '0.9rem' }}>
                                    {p.category}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button onClick={() => handleDelete(p.id)} style={{ color: '#d33', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { deleteProduct } from './actions';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();
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

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Admin <span style={{ color: 'var(--accent-color)' }}>Dashboard</span></h1>
                <button onClick={() => router.push('/admin/products/new')} className="btn btn-primary">
                    + Add New Product
                </button>
            </div>

            {/* Product List */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '1rem' }}>Product</th>
                        <th style={{ padding: '1rem' }}>Price</th>
                        <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '1rem' }}>
                                <div style={{ fontWeight: '700' }}>{p.name}</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{p.id}</div>
                            </td>
                            <td style={{ padding: '1rem' }}>${Number(p.price).toFixed(2)}</td>
                            <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => router.push(`/admin/products/${p.id}`)} style={{ background: 'transparent', color: 'var(--accent-color)', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Edit</button>
                                    <button onClick={() => deleteProduct(p.id).then(() => window.location.reload())} style={{ background: 'transparent', color: '#ff4b2b', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

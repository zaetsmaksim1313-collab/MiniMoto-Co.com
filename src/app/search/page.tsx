'use client';

import { useState, useEffect } from "react";
import { Product } from "@/lib/products";
import Link from "next/link";

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [results, setResults] = useState<Product[]>([]);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
    }, [query, products]);

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 className="section-title">Search <span style={{ color: 'var(--accent-color)' }}>Store</span></h1>

            <div style={{ maxWidth: '600px', margin: '0 auto 4rem auto' }}>
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1.2rem',
                        fontSize: '1.2rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        color: '#fff',
                        outline: 'none'
                    }}
                    autoFocus
                />
            </div>

            {query && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {results.map(product => (
                        <div key={product.id} className="glass" style={{ padding: '1rem' }}>
                            <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    height: '250px',
                                    background: `url(${product.images[0]}) no-repeat center/cover`,
                                    borderRadius: '8px',
                                    marginBottom: '1rem'
                                }}></div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                                <p style={{ color: 'var(--accent-color)', fontWeight: '700' }}>${product.price}</p>
                            </Link>
                        </div>
                    ))}
                    {results.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5, padding: '4rem' }}>
                            No products found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

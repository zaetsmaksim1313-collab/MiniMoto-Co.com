'use client';

import { Product } from '@/lib/products';
import { useState } from 'react';
import { updateProductOrder } from '../actions';

export default function CategoryOrderClient({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState(initialProducts);
    const [isSaving, setIsSaving] = useState(false);
    
    // Group products by category
    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    
    const moveUp = (index: number, category: string) => {
        if (index === 0) return;
        setProducts(prev => {
            const newProducts = [...prev];
            const catProducts = newProducts.filter(p => p.category === category);
            const otherProducts = newProducts.filter(p => p.category !== category);
            
            // Swap
            const temp = catProducts[index];
            catProducts[index] = catProducts[index - 1];
            catProducts[index - 1] = temp;
            
            return [...otherProducts, ...catProducts];
        });
    };
    
    const moveDown = (index: number, category: string) => {
        setProducts(prev => {
            const newProducts = [...prev];
            const catProducts = newProducts.filter(p => p.category === category);
            const otherProducts = newProducts.filter(p => p.category !== category);
            
            if (index === catProducts.length - 1) return prev;
            
            // Swap
            const temp = catProducts[index];
            catProducts[index] = catProducts[index + 1];
            catProducts[index + 1] = temp;
            
            return [...otherProducts, ...catProducts];
        });
    };
    
    const saveOrder = async () => {
        setIsSaving(true);
        // Create an array of updates with their global index
        const updates = products.map((p, idx) => ({ id: p.id, sort_order: idx }));
        
        const res = await updateProductOrder(updates);
        if (res.success) {
            alert('Order saved successfully!');
        } else {
            alert('Error saving order: ' + res.error);
        }
        setIsSaving(false);
    };

    return (
        <div className="category-order">
            <div className="header">
                <h1 className="admin-title" style={{marginBottom: 0}}>Product Categories & Sorting</h1>
                <button 
                    className="btn-admin btn-admin-primary" 
                    onClick={saveOrder} 
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Order'}
                </button>
            </div>
            
            <div className="categories-list">
                {categories.map(category => {
                    const catProducts = products.filter(p => p.category === category);
                    return (
                        <div key={category} className="category-card admin-card">
                            <h3 className="category-title">{category}</h3>
                            <div className="product-list">
                                {catProducts.map((p, idx) => (
                                    <div key={p.id} className="product-item">
                                        <div className="product-info">
                                            {p.images && p.images.length > 0 ? (
                                                <img src={p.images[0]} alt={p.name} className="product-thumb" />
                                            ) : (
                                                <div className="product-thumb-placeholder"></div>
                                            )}
                                            <span>{p.name}</span>
                                        </div>
                                        <div className="actions">
                                            <button 
                                                disabled={idx === 0} 
                                                onClick={() => moveUp(idx, category)}
                                                className="btn-move"
                                            >
                                                ↑ Up
                                            </button>
                                            <button 
                                                disabled={idx === catProducts.length - 1} 
                                                onClick={() => moveDown(idx, category)}
                                                className="btn-move"
                                            >
                                                ↓ Down
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {catProducts.length === 0 && (
                                    <p style={{ color: '#888', fontSize: '0.9rem' }}>No products in this category.</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <style jsx>{`
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .categories-list {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                .category-title {
                    margin-top: 0;
                    margin-bottom: 16px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #ebebeb;
                    text-transform: capitalize;
                }
                .product-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .product-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    background: #f9f9f9;
                    border: 1px solid #ebebeb;
                    border-radius: 6px;
                }
                .product-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 500;
                }
                .product-thumb {
                    width: 40px;
                    height: 40px;
                    object-fit: cover;
                    border-radius: 4px;
                }
                .product-thumb-placeholder {
                    width: 40px;
                    height: 40px;
                    background: #e0e0e0;
                    border-radius: 4px;
                }
                .actions {
                    display: flex;
                    gap: 8px;
                }
                .btn-move {
                    background: white;
                    border: 1px solid #ccc;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.8rem;
                }
                .btn-move:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                .btn-move:hover:not(:disabled) {
                    background: #eee;
                }
            `}</style>
        </div>
    );
}

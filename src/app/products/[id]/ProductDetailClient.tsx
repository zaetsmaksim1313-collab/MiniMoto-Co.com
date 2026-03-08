'use client';

import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductDetailClient({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
    const [totalPrice, setTotalPrice] = useState(product.price);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // Initialize with first values
        const initial: { [key: string]: string } = {};
        product.options.forEach(opt => {
            if (opt.values.length > 0) {
                initial[opt.name] = opt.values[0].value;
            }
        });
        setSelectedOptions(initial);
    }, [product]);

    useEffect(() => {
        let extra = 0;
        product.options.forEach(opt => {
            const selectedVal = selectedOptions[opt.name];
            const valObj = opt.values.find(v => v.value === selectedVal);
            if (valObj?.priceModifier) {
                extra += valObj.priceModifier;
            }
        });
        setTotalPrice(product.price + extra);
    }, [selectedOptions, product]);

    const handleOptionChange = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
    };

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: totalPrice,
            quantity: quantity,
            selectedOptions
        } as any);
        alert('Added to cart!');
    };

    return (
        <div className="product-page">
            <div className="container" style={{ padding: '4rem 0' }}>
                <div className="product-layout">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img src={product.images[0]} alt={product.name} />
                        </div>
                        <div className="thumbnail-grid">
                            {product.images.map((img, idx) => (
                                <div key={idx} className="thumb">
                                    <img src={img} alt={`${product.name} ${idx}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-details">
                        <nav className="breadcrumb">
                            <Link href="/">Home</Link> / <Link href="/products">Products</Link> / {product.name}
                        </nav>

                        <h1>{product.name}</h1>

                        <div className="price-area">
                            <span className="current-price">${totalPrice.toFixed(2)}</span>
                            {product.compareAtPrice && (
                                <span className="old-price">${product.compareAtPrice.toFixed(2)}</span>
                            )}
                        </div>

                        {/* Options */}
                        {product.options.map((opt) => (
                            <div key={opt.name} className="option-group">
                                <label>{opt.name}</label>
                                <div className="option-pills">
                                    {opt.values.map((v) => (
                                        <button
                                            key={v.value}
                                            className={`pill ${selectedOptions[opt.name] === v.value ? 'active' : ''}`}
                                            onClick={() => handleOptionChange(opt.name, v.value)}
                                        >
                                            {v.value}
                                            {v.priceModifier ? ` (+$${v.priceModifier})` : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="purchase-controls">
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <input type="number" value={quantity} readOnly />
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <button className="btn-add" onClick={handleAddToCart}>Add to cart</button>
                        </div>

                        <button className="btn-buy-now">Buy with <span style={{ fontWeight: 900 }}>shop</span></button>

                        <div className="description">
                            <p>{product.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .product-page {
                    background: white;
                    color: black;
                    min-height: 100vh;
                }

                .product-layout {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 4rem;
                }

                .main-image {
                    aspect-ratio: 1/1;
                    background: #f7f7f7;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }

                .main-image img { width: 100%; height: 100%; object-fit: cover; }

                .thumbnail-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                }

                .thumb {
                    aspect-ratio: 1/1;
                    background: #f7f7f7;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .thumb img { width: 100%; height: 100%; object-fit: cover; }

                .breadcrumb { font-size: 0.8rem; color: #666; margin-bottom: 1rem; }
                .breadcrumb a { color: #666; text-decoration: none; }

                h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.02em; }

                .price-area { margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; }
                .current-price { font-size: 1.5rem; font-weight: 700; color: #1a1a1a; }
                .old-price { font-size: 1.2rem; text-decoration: line-through; color: #999; }

                .option-group { margin-bottom: 1.5rem; }
                .option-group label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem; text-transform: none; color: #333; }

                .option-pills { display: flex; flex-wrap: wrap; gap: 0.75rem; }
                .pill {
                    padding: 10px 24px;
                    border: 1px solid #e2e2e2;
                    background: white;
                    border-radius: 50px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: black;
                }

                .pill:hover { border-color: black; }
                .pill.active { background: black; color: white; border-color: black; }

                .purchase-controls { display: flex; gap: 1rem; margin-top: 2rem; margin-bottom: 1rem; }
                .quantity-selector {
                    display: flex;
                    border: 1px solid #e2e2e2;
                    border-radius: 4px;
                }
                .quantity-selector button {
                    width: 40px; background: none; border: none; font-size: 1.2rem; cursor: pointer;
                }
                .quantity-selector input {
                    width: 50px; text-align: center; border: none; border-left: 1px solid #e2e2e2; border-right: 1px solid #e2e2e2; font-weight: 600;
                }

                .btn-add {
                    flex: 1;
                    background: white;
                    color: black;
                    border: 1.5px solid black;
                    padding: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    border-radius: 4px;
                }

                .btn-buy-now {
                    width: 100%;
                    background: #5a31f4;
                    color: white;
                    border: none;
                    padding: 14px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-bottom: 2rem;
                }

                .description { border-top: 1px solid #eee; padding-top: 2rem; line-height: 1.8; color: #444; }
            `}</style>
        </div>
    );
}

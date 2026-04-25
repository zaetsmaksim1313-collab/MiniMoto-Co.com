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
    const [mainImage, setMainImage] = useState(product.images[0]);

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
        addToCart(
            { ...product, price: totalPrice },
            selectedOptions,
            quantity
        );
        alert('Added to cart!');
    };

    return (
        <div className="product-page">
            <div className="split-layout">
                {/* Left Side: Sticky Image Gallery */}
                <div className="left-panel">
                    <img src={mainImage} className="full-image" alt={product.name} />
                    <div className="floating-thumbnails">
                        {product.images.map((img, idx) => (
                            <img 
                                key={idx} 
                                src={img} 
                                onClick={() => setMainImage(img)} 
                                className={`thumb ${mainImage === img ? 'active' : ''}`}
                                alt={`${product.name} thumbnail`} 
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side: Informational Content */}
                <div className="right-panel">
                    <div className="content-wrapper">
                        <h1 className="product-title">{product.name}</h1>
                        
                        <div className="price-area">
                            <span className="current-price">${totalPrice.toFixed(2)}</span>
                        </div>

                        {product.compareAtPrice && (
                            <p className="financing-text">
                                Pay over time for orders over $35.00 with <span style={{fontWeight: 'bold'}}>shopPay</span> <span style={{textDecoration: 'underline'}}>Learn more</span>
                            </p>
                        )}
                        {!product.compareAtPrice && (
                            <p className="financing-text">
                                Pay over time for orders over $35.00 with <span style={{fontWeight: 'bold'}}>shopPay</span> <span style={{textDecoration: 'underline'}}>Learn more</span>
                            </p>
                        )}

                        <div className="description">
                            <p>{product.description}</p>
                        </div>

                        {/* Options */}
                        <div className="options-container">
                            {product.options.map((opt) => {
                                const activeValObj = opt.values.find(v => v.value === selectedOptions[opt.name]);

                                return (
                                    <div key={opt.name} className="option-group">
                                        <div className="option-label">
                                            {opt.name.toLowerCase()} {activeValObj?.priceModifier ? `(+ $${activeValObj.priceModifier.toFixed(2)})` : ''} *
                                        </div>
                                        
                                        {opt.type === 'color' && (
                                            <div className="color-bubbles">
                                                {opt.values.map((v) => (
                                                    <button
                                                        key={v.value}
                                                        title={v.value}
                                                        type="button"
                                                        className={`color-bubble ${selectedOptions[opt.name] === v.value ? 'active' : ''}`}
                                                        style={{ background: v.colorHex || '#ccc' }}
                                                        onClick={() => handleOptionChange(opt.name, v.value)}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {opt.type === 'radio' && (
                                            <div className="radio-bubbles">
                                                {opt.values.map((v) => (
                                                    <label key={v.value} className="radio-item" onClick={() => handleOptionChange(opt.name, v.value)}>
                                                        <div className={`radio-circle ${selectedOptions[opt.name] === v.value ? 'active' : ''}`} />
                                                        <span className="radio-text">{v.value.toLowerCase()}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {(!opt.type || opt.type === 'selection') && (
                                            <div className="option-pills">
                                                {opt.values.map((v) => (
                                                    <button
                                                        key={v.value}
                                                        type="button"
                                                        className={`pill ${selectedOptions[opt.name] === v.value ? 'active' : ''}`}
                                                        onClick={() => handleOptionChange(opt.name, v.value)}
                                                    >
                                                        {v.value}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {opt.type === 'dropdown' && (
                                            <select 
                                                className="option-dropdown"
                                                value={selectedOptions[opt.name] || (opt.values[0]?.value || '')} 
                                                onChange={(e) => handleOptionChange(opt.name, e.target.value)}
                                            >
                                                {opt.values.map((v) => (
                                                    <option key={v.value} value={v.value}>
                                                        {v.value}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        {opt.type === 'textbox' && (
                                            <input 
                                                type="text"
                                                className="option-textbox"
                                                placeholder={`Enter ${opt.name}`}
                                                value={selectedOptions[opt.name] || ''}
                                                onChange={(e) => handleOptionChange(opt.name, e.target.value)}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="purchase-controls">
                            <div className="quantity-selector">
                                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <input type="number" value={quantity} readOnly />
                                <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <button className="btn-add" onClick={handleAddToCart}>Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .product-page {
                    background: #000;
                    color: #fff;
                    min-height: 100vh;
                    font-family: inherit;
                }

                .split-layout {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    width: 100vw;
                    min-height: 100vh;
                }

                @media (max-width: 900px) {
                    .split-layout {
                        grid-template-columns: 1fr;
                    }
                }

                .left-panel {
                    position: sticky;
                    top: 0;
                    height: 100vh;
                    overflow: hidden;
                    background: #111;
                }

                @media (max-width: 900px) {
                    .left-panel {
                        position: relative;
                        height: 60vh;
                    }
                }

                .full-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .floating-thumbnails {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    display: flex;
                    gap: 10px;
                    z-index: 10;
                }

                .thumb {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 4px;
                    border: 2px solid transparent;
                    cursor: pointer;
                    transition: transform 0.2s, border-color 0.2s;
                }

                .thumb:hover {
                    transform: scale(1.05);
                }

                .thumb.active {
                    border-color: #fff;
                }

                .right-panel {
                    background: #000;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    padding: 4rem 2rem;
                    min-height: 100vh;
                }

                .content-wrapper {
                    max-width: 500px;
                    width: 100%;
                }

                .product-title {
                    font-size: 2.2rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    margin-bottom: 0.5rem;
                    letter-spacing: -0.02em;
                }

                .price-area {
                    margin-bottom: 0.5rem;
                }

                .current-price {
                    font-size: 1.2rem;
                    color: #fff;
                }

                .financing-text {
                    font-size: 0.85rem;
                    color: #a3a3a3;
                    margin-bottom: 2rem;
                }

                .description {
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #e0e0e0;
                    margin-bottom: 3rem;
                }

                .options-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    margin-bottom: 3rem;
                }

                .option-label {
                    font-size: 1rem;
                    margin-bottom: 1rem;
                    color: #fff;
                }

                /* Bubble Configurations */
                .color-bubbles {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .color-bubble {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 2px solid transparent;
                    cursor: pointer;
                    box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
                    transition: all 0.2s;
                    outline: none;
                }

                .color-bubble:hover {
                    transform: scale(1.1);
                }

                .color-bubble.active {
                    border: 2px solid white;
                    box-shadow: inset 0 0 0 3px black;
                }

                /* Radio Configurations */
                .radio-bubbles {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .radio-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                }

                .radio-circle {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 2px solid white;
                    background: transparent;
                    transition: all 0.2s;
                }

                .radio-circle.active {
                    background: white;
                    box-shadow: inset 0 0 0 3px black;
                }

                .radio-text {
                    font-size: 1.2rem;
                    color: #fff;
                }

                /* Standard Option Settings */
                .option-pills { display: flex; flex-wrap: wrap; gap: 0.75rem; }
                .pill {
                    padding: 10px 24px;
                    border: 1px solid #444;
                    background: transparent;
                    border-radius: 50px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #fff;
                }

                .pill.active { background: white; color: black; border-color: white; }

                .option-dropdown, .option-textbox {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid #444;
                    border-radius: 4px;
                    font-size: 1rem;
                    color: white;
                    background: #111;
                    outline: none;
                }

                .purchase-controls { display: flex; gap: 1rem; margin-top: 1rem; }
                
                .quantity-selector {
                    display: flex;
                    border: 1px solid #444;
                    border-radius: 4px;
                    background: transparent;
                }
                .quantity-selector button {
                    width: 40px; background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;
                }
                .quantity-selector input {
                    width: 50px; text-align: center; border: none; background: transparent; color: white; font-weight: 600;
                }

                .btn-add {
                    flex: 1;
                    background: white;
                    color: black;
                    border: none;
                    padding: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    border-radius: 4px;
                    font-size: 1.1rem;
                }
            `}</style>
        </div>
    );
}

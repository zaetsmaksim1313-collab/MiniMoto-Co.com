'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ClientNav from './ClientNav';

const COLORS = [
    { name: 'Factory Black', hex: '#222222', filter: 'hue-rotate(0deg) saturate(0%) brightness(80%)' },
    { name: 'Racing Red', hex: '#e63946', filter: 'hue-rotate(320deg) saturate(200%)' },
    { name: 'Electric Blue', hex: '#0077b6', filter: 'hue-rotate(200deg) saturate(150%)' },
    { name: 'Slime Green', hex: '#aacc00', filter: 'hue-rotate(80deg) saturate(200%)' },
    { name: 'Neon Purple', hex: '#7209b7', filter: 'hue-rotate(270deg) saturate(150%)' },
];

const ACCESSORIES = [
    { id: 'pegs', name: 'Upgraded Foot Pegs', price: 49.99 },
    { id: 'bars', name: 'Pro Taper Handlebars', price: 89.99 },
    { id: 'grips', name: 'Lock-on Grips', price: 24.99 },
    { id: 'seat', name: 'Tall Gripper Seat', price: 119.99 },
];

const BASE_PRICE = 450.00;

export default function BikeCustomizerClient() {
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const toggleAccessory = (id: string) => {
        setSelectedAccessories(prev => 
            prev.includes(id) 
                ? prev.filter(a => a !== id) 
                : [...prev, id]
        );
    };

    const totalPrice = BASE_PRICE + selectedAccessories.reduce((sum, id) => {
        const acc = ACCESSORIES.find(a => a.id === id);
        return sum + (acc ? acc.price : 0);
    }, 0);

    const handleAddToCart = () => {
        setIsSaving(true);
        setTimeout(() => {
            alert('Custom Build added to cart! (Beta)');
            setIsSaving(false);
        }, 800);
    };

    return (
        <div className="customizer-wrapper">
            <ClientNav cartItemCount={0} />
            
            <main className="builder-layout">
                {/* Visualizer Panel */}
                <section className="viewer-section">
                    <div className="viewer-container">
                        <div className="bike-frame" style={{ filter: selectedColor.filter }}>
                            {/* Placeholder Bike Image - will respond to hue-rotate mock engine */}
                            <Image 
                                src="https://images.unsplash.com/photo-1558981403-c5f94bbde586" 
                                alt="Custom Mini Surron Base" 
                                fill 
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>

                        {/* Accessory Overlay Markers (Mock placeholders) */}
                        {selectedAccessories.includes('pegs') && (
                            <div className="acc-marker pegs">Pegs Upgraded</div>
                        )}
                        {selectedAccessories.includes('bars') && (
                            <div className="acc-marker bars">Bars Upgraded</div>
                        )}
                        {selectedAccessories.includes('seat') && (
                            <div className="acc-marker seat">Seat Upgraded</div>
                        )}
                    </div>
                </section>

                {/* Controls Panel */}
                <section className="controls-section">
                    <div className="controls-header">
                        <Link href="/" className="back-link">← Back to store</Link>
                        <h1>Build Your Bike</h1>
                        <p className="base-price">Starting at ${BASE_PRICE.toFixed(2)}</p>
                    </div>

                    <div className="controls-group">
                        <h3>Plastics Color</h3>
                        <p className="selection-label">{selectedColor.name}</p>
                        <div className="color-swatches">
                            {COLORS.map((c) => (
                                <button
                                    key={c.name}
                                    className={`swatch ${selectedColor.name === c.name ? 'active' : ''}`}
                                    style={{ backgroundColor: c.hex }}
                                    onClick={() => setSelectedColor(c)}
                                    aria-label={`Select ${c.name}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="controls-group">
                        <h3>Premium Accessories</h3>
                        <div className="accessory-list">
                            {ACCESSORIES.map((acc) => (
                                <label key={acc.id} className={`acc-card ${selectedAccessories.includes(acc.id) ? 'selected' : ''}`}>
                                    <div className="acc-info">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedAccessories.includes(acc.id)}
                                            onChange={() => toggleAccessory(acc.id)}
                                        />
                                        <span>{acc.name}</span>
                                    </div>
                                    <span className="acc-price">+${acc.price.toFixed(2)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Total & Checkout */}
                    <div className="checkout-footer">
                        <div className="price-summary">
                            <span>Total Build Price</span>
                            <span className="total-price">${totalPrice.toFixed(2)}</span>
                        </div>
                        <button 
                            className="btn-build" 
                            onClick={handleAddToCart}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Building...' : `Add to Cart - $${totalPrice.toFixed(2)}`}
                        </button>
                    </div>
                </section>
            </main>

            <style jsx>{`
                .customizer-wrapper {
                    min-height: 100vh;
                    background: #fdfdfd;
                    display: flex;
                    flex-direction: column;
                }

                .builder-layout {
                    display: flex;
                    flex: 1;
                    height: calc(100vh - 80px); /* Account for nav */
                    overflow: hidden;
                }

                /* Mobile switches to stacking */
                @media (max-width: 900px) {
                    .builder-layout {
                        flex-direction: column;
                        height: auto;
                        overflow: visible;
                    }
                }

                .viewer-section {
                    flex: 1.5;
                    background: #f4f4f5;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-right: 1px solid rgba(0,0,0,0.05);
                }

                @media (max-width: 900px) {
                    .viewer-section {
                        min-height: 50vh;
                        border-right: none;
                        border-bottom: 1px solid rgba(0,0,0,0.05);
                    }
                }

                .viewer-container {
                    width: 80%;
                    height: 80%;
                    position: relative;
                    /* A subtle pulsing shadow to make the viewer feel alive */
                    box-shadow: 0 40px 100px rgba(0,0,0,0.05);
                    background: #fff;
                    border-radius: 20px;
                }

                .bike-frame {
                    position: absolute;
                    inset: 0;
                    margin: 2rem;
                    transition: filter 0.5s ease;
                }

                .acc-marker {
                    position: absolute;
                    background: black;
                    color: white;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .pegs { bottom: 20%; left: 40%; }
                .bars { top: 30%; right: 30%; }
                .seat { top: 45%; left: 30%; }

                .controls-section {
                    flex: 1;
                    max-width: 500px;
                    background: #ffffff;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                    box-shadow: -20px 0 40px rgba(0,0,0,0.02);
                    z-index: 10;
                }

                @media (max-width: 900px) {
                    .controls-section {
                        max-width: 100%;
                    }
                }

                .controls-header {
                    padding: 2.5rem 2rem 1.5rem 2rem;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }

                .back-link {
                    font-size: 0.85rem;
                    color: #666;
                    text-decoration: none;
                    margin-bottom: 1rem;
                    display: inline-block;
                    transition: color 0.2s;
                }

                .back-link:hover {
                    color: #000;
                }

                .controls-header h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    margin: 0 0 0.5rem 0;
                }

                .base-price {
                    font-size: 1.1rem;
                    color: #666;
                    margin: 0;
                }

                .controls-group {
                    padding: 2rem;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }

                .controls-group h3 {
                    font-size: 1rem;
                    font-weight: 700;
                    margin: 0 0 0.5rem 0;
                }

                .selection-label {
                    font-size: 0.85rem;
                    color: #666;
                    margin: 0 0 1rem 0;
                }

                .color-swatches {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .swatch {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 2px solid transparent;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .swatch:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .swatch.active {
                    transform: scale(1.15);
                    border: 3px solid #000;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.2)
                }

                .accessory-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .acc-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .acc-card:hover {
                    border-color: #000;
                    background: #fafafa;
                }

                .acc-card.selected {
                    border-color: #000;
                    background: #f4f4f5;
                }

                .acc-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-size: 0.95rem;
                    font-weight: 500;
                }

                .acc-info input {
                    width: 18px;
                    height: 18px;
                    accent-color: #000;
                    cursor: pointer;
                }

                .acc-price {
                    font-size: 0.9rem;
                    color: #666;
                }

                .checkout-footer {
                    margin-top: auto;
                    padding: 2rem;
                    background: #fff;
                    box-shadow: 0 -10px 30px rgba(0,0,0,0.03);
                }

                .price-summary {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                .total-price {
                    font-size: 1.5rem;
                    font-weight: 800;
                }

                .btn-build {
                    width: 100%;
                    padding: 1rem;
                    background: #000;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .btn-build:hover:not(:disabled) {
                    background: #333;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
                }

                .btn-build:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}

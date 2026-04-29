'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/lib/products";
import MakeItYoursSection from "./MakeItYoursSection";

export default function HomeClient({ featuredProducts, accessories, allProducts, makeItYoursImages }: { featuredProducts: Product[], accessories?: Product[], allProducts?: Product[], makeItYoursImages: string[] }) {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero">
                <div style={{ position: 'absolute', inset: '-10%', transform: `translateY(${scrollY * 0.4}px)` }}>
                    <div className="hero-bg"></div>
                </div>
                <div className="hero-overlay"></div>
                <div className="hero-content container">
                    <h1 className="animate-fade-in-up">Fully Custom Mini Surrons</h1>
                    <hr className="hero-divider animate-fade-in-up delay-1" />
                    <p className="animate-fade-in-up delay-1">A premium, rider-built brand for hand-designed 3D-printed mini motos. The highest quality mini Surrons out there.</p>
                    <div className="animate-fade-in-up delay-2" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                        <Link href="/products" className="btn-hero">Shop all</Link>
                    </div>
                </div>
            </section>

            {/* Make It Yours Collage */}
            <MakeItYoursSection images={makeItYoursImages} />

            {/* EMOTOS Section */}
            <section className="featured-section emotos-section">
                <div className="container">
                    <div className="emotos-header">
                        <h2>EMOTOS</h2>
                        <Link href="/products" className="shop-all-link">SHOP ALL</Link>
                    </div>
                    <div className="emotos-grid">
                        {featuredProducts.map((p) => (
                            <div key={p.id} className="emoto-card">
                                <Link href={`/products/${p.id}`}>
                                    <div className="emoto-image-container">
                                        <span className="badge-sold-out">SOLD OUT</span>
                                        <img src={p.images[0]} alt={p.name} />
                                    </div>
                                    <div className="emoto-info">
                                        <h3 className="emoto-name">{p.name.toUpperCase()}</h3>
                                        <div className="emoto-price">
                                            <span>${p.price.toFixed(2)}</span>
                                            {p.compareAtPrice && <span className="compare-price">${p.compareAtPrice.toFixed(2)}</span>}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mini Moto Accessories */}
            <section className="featured-section emotos-section">
                <div className="container">
                    <div className="emotos-header">
                        <h2>ACCESSORIES</h2>
                        <Link href="/products?category=accessories" className="shop-all-link">SHOP ALL</Link>
                    </div>
                    <div className="emotos-grid">
                        {accessories && accessories.length > 0 ? accessories.map((p) => (
                            <div key={p.id} className="emoto-card">
                                <Link href={`/products/${p.id}`}>
                                    <div className="emoto-image-container">
                                        <span className="badge-sold-out">SOLD OUT</span>
                                        <img src={p.images[0]} alt={p.name} />
                                    </div>
                                    <div className="emoto-info">
                                        <h3 className="emoto-name">{p.name.toUpperCase()}</h3>
                                        <div className="emoto-price">
                                            <span>${p.price.toFixed(2)}</span>
                                            {p.compareAtPrice && <span className="compare-price">${p.compareAtPrice.toFixed(2)}</span>}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )) : <p style={{opacity: 0.5}}>No accessories added yet.</p>}
                    </div>
                </div>
            </section>

            {/* All Products */}
            <section className="featured-section emotos-section">
                <div className="container">
                    <div className="emotos-header">
                        <h2>ALL PRODUCTS</h2>
                        <Link href="/products" className="shop-all-link">SHOP ALL</Link>
                    </div>
                    <div className="emotos-grid">
                        {allProducts && allProducts.map((p) => (
                            <div key={p.id} className="emoto-card">
                                <Link href={`/products/${p.id}`}>
                                    <div className="emoto-image-container">
                                        <span className="badge-sold-out">SOLD OUT</span>
                                        <img src={p.images[0]} alt={p.name} />
                                    </div>
                                    <div className="emoto-info">
                                        <h3 className="emoto-name">{p.name.toUpperCase()}</h3>
                                        <div className="emoto-price">
                                            <span>${p.price.toFixed(2)}</span>
                                            {p.compareAtPrice && <span className="compare-price">${p.compareAtPrice.toFixed(2)}</span>}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx>{`
                .hero {
                    position: relative;
                    height: 85vh;
                    width: 100%;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    background-color: #000;
                }

                .hero-bg {
                    position: absolute;
                    inset: -5%;
                    width: 110%;
                    height: 110%;
                    background-image: url('/hero-bg.JPG');
                    background-size: cover;
                    background-position: center;
                    z-index: 0;
                    animation: heroPan 30s infinite alternate ease-in-out;
                }

                @keyframes heroPan {
                    0% { transform: scale(1) translate(0, 0); }
                    100% { transform: scale(1.05) translate(-1.5%, -1.5%); }
                }

                @supports (-webkit-touch-callout: none) {
                    .hero-bg {
                        animation: none;
                    }
                }

                .hero-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.25);
                    z-index: 1;
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                    max-width: 800px;
                    text-align: center;
                    margin: 0 auto;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }

                .hero-content h1 {
                    font-size: clamp(2.5rem, 8vw, 5rem);
                    font-weight: 500;
                    letter-spacing: -0.02em;
                    line-height: 1.1;
                }
                
                .hero-divider {
                    width: 60%;
                    border: none;
                    height: 2px;
                    background-color: white;
                }

                .hero-content p {
                    font-size: 1.15rem;
                    font-weight: 400;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .btn-hero {
                    position: relative;
                    display: inline-block;
                    padding: 16px 40px;
                    background: transparent;
                    border-radius: 50px;
                    color: black;
                    text-decoration: none;
                    font-weight: 800;
                    font-size: 1.1rem;
                    transition: color 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                    overflow: hidden;
                    z-index: 1;
                }

                .btn-hero::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: white;
                    z-index: -1;
                    border-radius: 50px;
                    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                }

                .btn-hero::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: black;
                    z-index: -2;
                    border-radius: 50px;
                }

                .btn-hero:hover {
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                }

                .btn-hero:hover::before {
                    transform: scaleY(0);
                    transform-origin: top;
                }

                .featured-section {
                    padding: 4rem 0;
                    width: 100%;
                }

                .emotos-section {
                    background: white;
                }

                .emotos-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 2.5rem;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 1rem;
                }

                .emotos-header h2 {
                    font-size: 3.5rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    margin: 0;
                    line-height: 1;
                }

                .shop-all-link {
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-decoration: none;
                    color: black;
                    letter-spacing: 0.05em;
                    padding-bottom: 4px;
                }

                .shop-all-link:hover {
                    opacity: 0.7;
                }

                .emotos-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                }

                @media (max-width: 1024px) {
                    .emotos-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 480px) {
                    .emotos-grid {
                        grid-template-columns: 1fr;
                    }
                    .emotos-header h2 {
                        font-size: 2.5rem;
                    }
                }

                .emoto-card {
                    text-decoration: none;
                    transition: transform 0.3s ease;
                }

                .emoto-card a {
                    text-decoration: none;
                    color: inherit;
                }

                .emoto-image-container {
                    position: relative;
                    aspect-ratio: 1 / 1.1;
                    background: #f5f5f5;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }

                .emoto-image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .emoto-card:hover img {
                    transform: scale(1.05);
                }

                .badge-sold-out {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: black;
                    color: white;
                    padding: 5px 12px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    z-index: 5;
                }

                .emoto-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                }

                .emoto-name {
                    font-size: 0.9rem;
                    font-weight: 700;
                    margin: 0;
                    color: black;
                }

                .emoto-price {
                    font-size: 0.9rem;
                    color: #333;
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }

                .compare-price {
                    text-decoration: line-through;
                    color: #999;
                    font-weight: 400;
                }

                .premium-footer {
                    background: #111;
                    color: #fff;
                    padding: 6rem 0 2rem 0;
                    width: 100%;
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1.5fr;
                    gap: 3rem;
                    margin-bottom: 4rem;
                }

                .footer-brand h2 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    margin-bottom: 1rem;
                }

                .footer-brand p {
                    color: #888;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    max-width: 80%;
                }

                .footer-links h4, .footer-newsletter h4 {
                    font-size: 0.9rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 1.5rem;
                    color: #fff;
                }

                .footer-links a {
                    display: block;
                    color: #888;
                    text-decoration: none;
                    margin-bottom: 0.8rem;
                    font-size: 0.95rem;
                    transition: color 0.3s;
                }

                .footer-links a:hover {
                    color: #fff;
                }

                .newsletter-input {
                    display: flex;
                    border-bottom: 1px solid #333;
                    padding-bottom: 0.5rem;
                }

                .newsletter-input input {
                    background: transparent;
                    border: none;
                    color: #fff;
                    flex: 1;
                    outline: none;
                    font-size: 0.95rem;
                }

                .newsletter-input input::placeholder {
                    color: #666;
                }

                .newsletter-input button {
                    background: transparent;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: transform 0.3s;
                }

                .newsletter-input button:hover {
                    transform: translateX(4px);
                }

                .footer-bottom {
                    border-top: 1px solid #222;
                    padding-top: 2rem;
                    display: flex;
                    justify-content: space-between;
                    color: #666;
                    font-size: 0.85rem;
                }

                @media (max-width: 768px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        gap: 2.5rem;
                    }
                    .footer-brand p {
                        max-width: 100%;
                    }
                }
            `}</style>
            {/* Dark Mode Footer */}
            <footer className="premium-footer">
                <div className="container footer-grid">
                    <div className="footer-brand">
                        <h2>MINI MOTO CO</h2>
                        <p>Hand-designed, 3D-printed perfection. The ultimate custom mini Surron experience.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Explore</h4>
                        <Link href="/products">All Bikes</Link>
                        <Link href="/products?category=accessories">Accessories</Link>
                        <Link href="/products?category=Upgrades">Upgrades</Link>
                        <Link href="/decal-builder">Decal Lab</Link>
                    </div>
                    <div className="footer-links">
                        <h4>Company</h4>
                        <Link href="#">About Us</Link>
                        <Link href="#">Contact</Link>
                        <Link href="#">Shipping & Returns</Link>
                    </div>
                    <div className="footer-newsletter">
                        <h4>Join the cult</h4>
                        <div className="newsletter-input">
                            <input type="email" placeholder="Email Address" />
                            <button type="submit">→</button>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom container">
                    <p>&copy; {new Date().getFullYear()} Mini Moto Co. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

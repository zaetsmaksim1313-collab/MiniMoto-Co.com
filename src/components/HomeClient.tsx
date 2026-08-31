'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/lib/products";
import MakeItYoursSection from "./MakeItYoursSection";

export default function HomeClient({ featuredProducts, ebikes, pedalBikes, accessories, allProducts, makeItYoursImages }: { featuredProducts: Product[], ebikes?: Product[], pedalBikes?: Product[], accessories?: Product[], allProducts?: Product[], makeItYoursImages: string[] }) {
    const [scrollY, setScrollY] = useState(0);
    const [showAllEmotos, setShowAllEmotos] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Matching logic for the 4 target bikes
    const matchProductByName = (productName: string) => {
        const nameLower = productName.toLowerCase();
        if (nameLower.includes('200%') && nameLower.includes('surron') && nameLower.includes('lbx')) {
            return '200% surron lbx';
        }
        if (nameLower.includes('surron') && nameLower.includes('lbx')) {
            return 'surron lbx';
        }
        if (nameLower.includes('ultra bee')) {
            return 'ultra bee';
        }
        if (nameLower.includes('talaria x3') || (nameLower.includes('talaria') && nameLower.includes('x3'))) {
            return 'talaria x3';
        }
        return null;
    };

    const targetOrder = ['surron lbx', 'ultra bee', 'talaria x3', '200% surron lbx'];
    const targetBikesMap: { [key: string]: Product } = {};
    const otherBikes: Product[] = [];

    featuredProducts.forEach(p => {
        const match = matchProductByName(p.name);
        if (match && !targetBikesMap[match]) {
            targetBikesMap[match] = p;
        } else {
            otherBikes.push(p);
        }
    });

    const initialBikes: Product[] = [];
    targetOrder.forEach(key => {
        if (targetBikesMap[key]) {
            initialBikes.push(targetBikesMap[key]);
        }
    });

    const tempOtherBikes = [...otherBikes];
    while (initialBikes.length < 4 && tempOtherBikes.length > 0) {
        initialBikes.push(tempOtherBikes.shift()!);
    }

    const displayedEmotos = showAllEmotos 
        ? [...initialBikes, ...tempOtherBikes] 
        : initialBikes;

    return (
        <div className="home-container">
            {/* ── CINEMATIC HERO ─────────────────────────────────────────── */}
            <section className="hero">
                {/* Parallax photo layer */}
                <div className="hero-photo-wrap" style={{ transform: `translateY(${scrollY * 0.32}px)` }}>
                    <img src="/hero-bikes.jpg" alt="Minimoto&amp;Co bikes" className="hero-photo" />
                </div>

                {/* Multi-stop gradient overlay */}
                <div className="hero-overlay" />

                {/* Bottom fade to white for smooth section transition */}
                <div className="hero-bottom-fade" />

                {/* Content */}
                <div className="hero-content container">
                    {/* Eyebrow badge */}
                    <div className="hero-badge animate-fade-in-up">
                        <span className="hero-badge-dot" />
                        Est. 2024 &nbsp;·&nbsp; Custom Mini Motos &nbsp;·&nbsp; USA
                    </div>

                    {/* Brand name */}
                    <h1 className="hero-wordmark animate-fade-in-up delay-1">
                        MINIMOTO<span className="hero-amp">&amp;</span>CO
                    </h1>

                    {/* Slogan */}
                    <p className="hero-slogan animate-fade-in-up delay-2">
                        Go mini or go home.
                    </p>

                    {/* Supporting copy */}
                    <p className="hero-sub animate-fade-in-up delay-3">
                        Hand-built. Fully custom. The highest-quality mini electric motos on the market.
                    </p>

                    {/* CTAs */}
                    <div className="hero-ctas animate-fade-in-up delay-3">
                        <Link href="/products" className="btn-hero-primary">Shop the Collection</Link>
                        <Link href="/decal-builder" className="btn-hero-ghost">Build a Decal →</Link>
                    </div>

                    {/* Stat bar */}
                    <div className="hero-stats animate-fade-in-up delay-3">
                        <div className="hero-stat"><span className="stat-num">100%</span><span className="stat-label">Custom Builds</span></div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat"><span className="stat-num">4</span><span className="stat-label">Models Available</span></div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat"><span className="stat-num">∞</span><span className="stat-label">Colorways</span></div>
                    </div>
                </div>
            </section>

            {/* EMOTOS Section */}
            <section className="featured-section emotos-section">
                <div className="container">
                    <div className="emotos-header">
                        <h2>EMOTOS</h2>
                        <Link href="/products?category=Emotos" className="shop-all-link">SHOP ALL</Link>
                    </div>
                    <div className="emotos-grid">
                        {displayedEmotos && displayedEmotos.length > 0 ? displayedEmotos.map((p) => (
                            <div key={p.id} className="emoto-card">
                                <Link href={`/products/${p.id}`}>
                                    <div className="emoto-image-container">
                                        {p.status === 'Draft' && <span className="badge-sold-out">SOLD OUT</span>}
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
                        )) : <p style={{opacity: 0.5}}>No emotos added yet.</p>}
                    </div>
                    {featuredProducts.length > 4 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                            <button 
                                type="button"
                                onClick={() => setShowAllEmotos(!showAllEmotos)}
                                className="btn-more-emotos"
                            >
                                {showAllEmotos ? 'SHOW LESS' : 'MORE EMOTOS'}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* E-BIKES Section */}
            <section className="featured-section emotos-section">
                <div className="container">
                    <div className="emotos-header">
                        <h2>E BIKES</h2>
                        <Link href="/products?category=E Bikes" className="shop-all-link">SHOP ALL</Link>
                    </div>
                    <div className="emotos-grid">
                        {ebikes && ebikes.length > 0 ? ebikes.map((p) => (
                            <div key={p.id} className="emoto-card">
                                <Link href={`/products/${p.id}`}>
                                    <div className="emoto-image-container">
                                        {p.status === 'Draft' && <span className="badge-sold-out">SOLD OUT</span>}
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
                        )) : <p style={{opacity: 0.5}}>No e-bikes added yet.</p>}
                    </div>
                </div>
            </section>

            {/* PEDAL BIKES Section */}
            <section className="featured-section emotos-section">
                <div className="container">
                    <div className="emotos-header">
                        <h2>PEDAL BIKES</h2>
                        <Link href="/products?category=Pedal Bikes" className="shop-all-link">SHOP ALL</Link>
                    </div>
                    <div className="emotos-grid">
                        {pedalBikes && pedalBikes.length > 0 ? pedalBikes.map((p) => (
                            <div key={p.id} className="emoto-card">
                                <Link href={`/products/${p.id}`}>
                                    <div className="emoto-image-container">
                                        {p.status === 'Draft' && <span className="badge-sold-out">SOLD OUT</span>}
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
                        )) : <p style={{opacity: 0.5}}>No pedal bikes added yet.</p>}
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
                                        {p.status === 'Draft' && <span className="badge-sold-out">SOLD OUT</span>}
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
                                        {p.status === 'Draft' && <span className="badge-sold-out">SOLD OUT</span>}
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
                /* ── HERO ────────────────────────────────────────── */
                .hero {
                    position: relative;
                    height: 100vh;
                    min-height: 640px;
                    width: 100%;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    background: #000;
                }

                .hero-photo-wrap {
                    position: absolute;
                    inset: -14% 0;
                    will-change: transform;
                }

                .hero-photo {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center 60%;
                    display: block;
                }

                /* Dark radial + linear combo overlay */
                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.62) 100%),
                        linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.0) 55%);
                    z-index: 1;
                }

                /* Seamless fade into the white product section below */
                .hero-bottom-fade {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 180px;
                    background: linear-gradient(to bottom, transparent, #ffffff);
                    z-index: 2;
                }

                .hero-content {
                    position: relative;
                    z-index: 3;
                    max-width: 860px;
                    text-align: center;
                    margin: 0 auto;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.2rem;
                    padding-bottom: 80px;
                }

                /* Eyebrow badge */
                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255,255,255,0.10);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.22);
                    border-radius: 999px;
                    padding: 6px 18px;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.90);
                }

                .hero-badge-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #ff69b4;
                    display: inline-block;
                    box-shadow: 0 0 8px #ff69b4;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.4); }
                }

                /* Giant brand wordmark */
                .hero-wordmark {
                    font-size: clamp(3.2rem, 9vw, 7rem);
                    font-weight: 900;
                    letter-spacing: -0.03em;
                    line-height: 1;
                    text-transform: uppercase;
                    margin: 0;
                    text-shadow: 0 4px 40px rgba(0,0,0,0.5);
                }

                .hero-amp {
                    color: #ff69b4;
                    font-style: italic;
                }

                /* Slogan */
                .hero-slogan {
                    font-size: clamp(1.3rem, 3.5vw, 2rem);
                    font-style: italic;
                    font-weight: 300;
                    letter-spacing: 0.01em;
                    margin: 0;
                    opacity: 0.92;
                }

                /* Sub-copy */
                .hero-sub {
                    font-size: clamp(0.85rem, 2vw, 1.05rem);
                    font-weight: 400;
                    color: rgba(255,255,255,0.72);
                    max-width: 520px;
                    line-height: 1.65;
                    margin: 0;
                }

                /* CTA buttons */
                .hero-ctas {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    justify-content: center;
                    margin-top: 0.4rem;
                }

                .btn-hero-primary {
                    display: inline-block;
                    padding: 15px 36px;
                    background: #fff;
                    color: #000;
                    border-radius: 999px;
                    font-weight: 800;
                    font-size: 0.95rem;
                    letter-spacing: 0.04em;
                    text-decoration: none;
                    text-transform: uppercase;
                    transition: all 0.3s cubic-bezier(0.25,1,0.5,1);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
                }

                .btn-hero-primary:hover {
                    background: #ff69b4;
                    color: #fff;
                    transform: translateY(-3px);
                    box-shadow: 0 14px 36px rgba(255,105,180,0.4);
                }

                .btn-hero-ghost {
                    display: inline-block;
                    padding: 15px 36px;
                    background: transparent;
                    color: #fff;
                    border: 1.5px solid rgba(255,255,255,0.55);
                    border-radius: 999px;
                    font-weight: 700;
                    font-size: 0.95rem;
                    letter-spacing: 0.04em;
                    text-decoration: none;
                    text-transform: uppercase;
                    backdrop-filter: blur(8px);
                    transition: all 0.3s cubic-bezier(0.25,1,0.5,1);
                }

                .btn-hero-ghost:hover {
                    background: rgba(255,255,255,0.15);
                    border-color: #fff;
                    transform: translateY(-3px);
                }

                /* Stat bar */
                .hero-stats {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    margin-top: 0.6rem;
                    padding: 16px 28px;
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 16px;
                }

                .hero-stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                }

                .stat-num {
                    font-size: 1.55rem;
                    font-weight: 900;
                    letter-spacing: -0.02em;
                    color: #fff;
                }

                .stat-label {
                    font-size: 0.65rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: rgba(255,255,255,0.55);
                }

                .hero-stat-divider {
                    width: 1px;
                    height: 36px;
                    background: rgba(255,255,255,0.18);
                }

                /* Animations */
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s cubic-bezier(0.25,1,0.5,1) both;
                }
                .delay-1 { animation-delay: 0.15s; }
                .delay-2 { animation-delay: 0.28s; }
                .delay-3 { animation-delay: 0.40s; }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(22px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 600px) {
                    .hero-stats { gap: 1.2rem; padding: 12px 18px; }
                    .stat-num { font-size: 1.2rem; }
                    .hero-ctas { flex-direction: column; align-items: center; }
                    .btn-hero-primary, .btn-hero-ghost { width: 100%; text-align: center; }
                }

                .featured-section {
                    padding: 4rem 0;
                    width: 100%;
                }

                .emotos-section {
                    background: white;
                }

                .btn-more-emotos {
                    display: inline-block;
                    padding: 14px 36px;
                    background: black;
                    color: white;
                    border: 2px solid black;
                    border-radius: 50px;
                    font-weight: 800;
                    font-size: 0.9rem;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
                    text-transform: uppercase;
                    outline: none;
                }
                .btn-more-emotos:hover {
                    background: transparent;
                    color: black;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                }
                .btn-more-emotos:active {
                    transform: translateY(0);
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
                        <Link href="/products?category=Emotos">Emotos</Link>
                        <Link href="/products?category=E%20Bikes">E Bikes</Link>
                        <Link href="/products?category=E%20Scooters">E Scooters</Link>
                        <Link href="/products?category=Pedal%20Bikes">Pedal Bikes</Link>
                        <Link href="/products?category=Prebuilts">Prebuilts</Link>
                        <Link href="/products?category=accessories">Accessories</Link>
                        <Link href="/products?category=Upgrades">Upgrades</Link>
                        <Link href="/products?category=Upgraded Controllers">Upgraded Controllers</Link>
                        <Link href="/products?category=Tyres">Tyres</Link>
                        <Link href="/products?category=Upgraded Forks">Upgraded Forks</Link>
                        <Link href="/products?category=Seat Covers">Seat Covers</Link>
                        <Link href="/products?category=Upgraded Batteries">Upgraded Batteries</Link>
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

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

            {/* Featured Products */}
            <section className="featured-section alt-bg">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <span className="section-subtitle">FEATURED</span>
                            <h2>New Releases</h2>
                        </div>
                        <Link href="/products" className="btn-outline-pill">View all</Link>
                    </div>
                    <div className="carousel">
                        {featuredProducts.map((p) => (
                            <div key={p.id} className="carousel-card-small">
                                <Link href={`/products/${p.id}`}>
                                    <div className="image-container">
                                        {p.compareAtPrice && <span className="badge-sale">Sale</span>}
                                        <img src={p.images[0]} alt={p.name} />
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mini Moto Accessories */}
            <section className="featured-section alt-bg">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <span className="section-subtitle">ADD-ONS</span>
                            <h2>Mini Moto Accessories</h2>
                        </div>
                        <Link href="/products?category=accessories" className="btn-outline-pill">View all</Link>
                    </div>
                    <div className="carousel">
                        {accessories && accessories.length > 0 ? accessories.map((p) => (
                            <div key={p.id} className="carousel-card-small">
                                <Link href={`/products/${p.id}`}>
                                    <div className="image-container">
                                        {p.compareAtPrice && <span className="badge-sale">Sale</span>}
                                        <img src={p.images[0]} alt={p.name} />
                                    </div>
                                </Link>
                            </div>
                        )) : <p style={{opacity: 0.5}}>No accessories added yet.</p>}
                    </div>
                </div>
            </section>

            {/* All Products */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <span className="section-subtitle">COLLECTION</span>
                            <h2>All Products</h2>
                        </div>
                        <Link href="/products" className="btn-outline-pill">View all</Link>
                    </div>
                    <div className="carousel">
                        {allProducts && allProducts.map((p) => (
                            <div key={p.id} className="carousel-card-small">
                                <Link href={`/products/${p.id}`}>
                                    <div className="image-container">
                                        {p.compareAtPrice && <span className="badge-sale">Sale</span>}
                                        <img src={p.images[0]} alt={p.name} />
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
                    padding: 3rem 0;
                    width: 100%;
                }

                .alt-bg {
                    background: radial-gradient(circle at 50% 0%, #fefefe 0%, #f4f4f5 100%);
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 20px 40px rgba(0,0,0,0.03);
                    border-top: 1px solid rgba(0,0,0,0.06);
                    border-bottom: 1px solid rgba(0,0,0,0.06);
                    position: relative;
                    z-index: 10;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 2rem;
                }

                .section-header div {
                    display: flex;
                    flex-direction: column;
                }

                .section-subtitle {
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    color: var(--accent-secondary);
                    margin-bottom: 0.3rem;
                }

                .section-header h2 {
                    font-size: 2rem;
                    font-weight: 700;
                    line-height: 1;
                }

                .btn-outline-pill {
                    display: inline-block;
                    position: relative;
                    padding: 10px 28px;
                    border: 1px solid rgba(0,0,0,0.15);
                    border-radius: 50px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-decoration: none;
                    color: black;
                    background: transparent;
                    transition: color 0.4s ease, border-color 0.4s ease, transform 0.3s ease;
                    overflow: hidden;
                    z-index: 1;
                }

                .btn-outline-pill::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: black;
                    z-index: -1;
                    transform: scaleY(0);
                    transform-origin: bottom;
                    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                }

                .btn-outline-pill:hover {
                    color: white;
                    border-color: black;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                }

                .btn-outline-pill:hover::before {
                    transform: scaleY(1);
                }

                .carousel {
                    display: flex;
                    gap: 1.5rem;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    padding-bottom: 2rem;
                    width: 100%;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .carousel::-webkit-scrollbar {
                    display: none;
                }

                .carousel-card-small {
                    flex: 0 0 160px;
                    scroll-snap-align: start;
                    transition: transform 0.3s;
                }

                @media (max-width: 768px) {
                    .carousel-card-small {
                        flex: 0 0 140px;
                    }
                }

                .carousel-card-small:hover {
                    /* Subtle lift can go here, or handled by img scale */
                }

                .carousel-card-small:hover .image-container img {
                    transform: scale(1.06);
                }

                .carousel-card-small a {
                    text-decoration: none;
                    color: inherit;
                    display: block;
                    width: 100%;
                }

                .carousel-card {
                    flex: 0 0 320px;
                    scroll-snap-align: start;
                    transition: transform 0.3s;
                }

                @media (max-width: 768px) {
                    .carousel-card {
                        flex: 0 0 280px;
                    }
                }

                .carousel-card:hover {
                    /* Handled by img scale */
                }

                .carousel-card:hover .image-container img {
                    transform: scale(1.06);
                }

                .carousel-card a {
                    text-decoration: none;
                    color: inherit;
                    display: block;
                    width: 100%;
                }

                .image-container {
                    position: relative;
                    aspect-ratio: 1/1;
                    background: #fdfdfd;
                    border-radius: 12px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.04);
                    transition: box-shadow 0.4s ease;
                }

                .carousel-card-small:hover .image-container,
                .carousel-card:hover .image-container {
                    box-shadow: 0 12px 32px rgba(0,0,0,0.08);
                }

                .image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
                }

                .badge-sale {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: black;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    z-index: 10;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
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
                        <Link href="/customizer">Bike Builder</Link>
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

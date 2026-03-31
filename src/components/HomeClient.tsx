'use client';

import Link from "next/link";
import { Product } from "@/lib/products";

export default function HomeClient({ featuredProducts, accessories, allProducts }: { featuredProducts: Product[], accessories?: Product[], allProducts?: Product[] }) {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-overlay"></div>
                <img
                    src="/hero-bg.JPG"
                    alt="Hero"
                    className="hero-image"
                />
                <div className="hero-content container">
                    <h1 className="text-gradient-premium animate-fade-in-up">Fully Custom Mini Surrons</h1>
                    <hr className="hero-divider animate-fade-in-up delay-1" />
                    <p className="animate-fade-in-up delay-1">A premium, rider-built brand for hand-designed 3D-printed mini motos. The highest quality mini Surrons out there.</p>
                    <Link href="/products" className="btn-hero animate-fade-in-up delay-2">Shop all</Link>
                </div>
            </section>

            {/* Featured Products */}
            <section className="featured-section container">
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
            </section>

            {/* Mini Moto Accessories */}
            <section className="featured-section container">
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
            </section>

            {/* All Products */}
            <section className="featured-section container">
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

                .hero-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    z-index: 0;
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
                }

                .hero-content h1 {
                    font-size: 5rem;
                    font-weight: 500;
                    letter-spacing: -0.02em;
                    margin-bottom: 1rem;
                    line-height: 1.1;
                }
                
                .hero-divider {
                    width: 60%;
                    margin: 0 auto 1.5rem auto;
                    border: none;
                    height: 2px;
                    background-color: white;
                }

                .hero-content p {
                    font-size: 1.15rem;
                    margin-bottom: 2.5rem;
                    font-weight: 400;
                }

                .btn-hero {
                    display: inline-block;
                    padding: 14px 36px;
                    background: white;
                    border-radius: 50px;
                    color: black;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 1.1rem;
                    transition: all 0.3s;
                }

                .btn-hero:hover {
                    background: #eee;
                    transform: translateY(-2px);
                }

                .featured-section {
                    padding: 4rem 0;
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
                    padding: 8px 24px;
                    border: 1px solid rgba(0,0,0,0.15);
                    border-radius: 50px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-decoration: none;
                    color: black;
                    transition: all 0.3s ease;
                }
                
                .btn-outline-pill:hover {
                    border-color: black;
                    background: black;
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
                    flex: 0 0 220px;
                    scroll-snap-align: start;
                    transition: transform 0.3s;
                }

                @media (max-width: 768px) {
                    .carousel-card-small {
                        flex: 0 0 180px;
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
                    background: #fff;
                    color: black;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    z-index: 10;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
}

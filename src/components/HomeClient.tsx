'use client';

import Link from "next/link";
import { Product } from "@/lib/products";

export default function HomeClient({ featuredProducts }: { featuredProducts: Product[] }) {
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
                    <h1>Fully Custom Mini Surrons For Riders, By Riders</h1>
                    <p>A premium, rider-built brand for hand-designed 3D-printed mini motos. The highest quality mini Surrons out there.</p>
                    <Link href="/products" className="btn-hero">Shop all</Link>
                </div>
            </section>

            {/* Featured Products */}
            <section className="featured-section container">
                <div className="section-header">
                    <h2>New Releases</h2>
                    <Link href="/products" className="view-all">View all</Link>
                </div>
                <div className="product-grid">
                    {featuredProducts.map((p) => (
                        <div key={p.id} className="product-card">
                            <Link href={`/products/${p.id}`}>
                                <div className="image-container">
                                    {p.compareAtPrice && <span className="badge-sale">Sale</span>}
                                    <img src={p.images[0]} alt={p.name} />
                                </div>
                                <div className="product-info">
                                    <h3>{p.name}</h3>
                                    <div className="price-container">
                                        <span className="price">${p.price.toFixed(2)}</span>
                                        {p.compareAtPrice && <span className="compare-price">${p.compareAtPrice.toFixed(2)}</span>}
                                    </div>
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
                    background-color: white;
                }

                .hero-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    z-index: 0;
                }

                .hero-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.8) 100%);
                    z-index: 1;
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                    max-width: 800px;
                    text-align: center;
                    margin: 0 auto;
                    color: black;
                }

                .hero-content h1 {
                    font-size: 4.5rem;
                    font-weight: 900;
                    margin-bottom: 1.5rem;
                    line-height: 1.1;
                    text-shadow: 0 0 15px white;
                }

                .hero-content p {
                    font-size: 1.25rem;
                    margin-bottom: 2.5rem;
                    font-weight: 600;
                    text-shadow: 0 0 10px white;
                }

                .btn-hero {
                    display: inline-block;
                    padding: 14px 36px;
                    background: black;
                    border-radius: 50px;
                    color: white;
                    text-decoration: none;
                    font-weight: 800;
                    font-size: 1.1rem;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }

                .btn-hero:hover {
                    background: #333;
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

                .section-header h2 {
                    font-size: 2rem;
                    font-weight: 700;
                }

                .view-all {
                    color: black;
                    text-decoration: underline;
                    font-weight: 600;
                }

                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 2rem;
                }

                .product-card {
                    transition: transform 0.3s;
                }

                .product-card:hover {
                    transform: translateY(-5px);
                }

                .product-card a {
                    text-decoration: none;
                    color: inherit;
                }

                .image-container {
                    position: relative;
                    aspect-ratio: 1/1;
                    background: #f1f1f1;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }

                .image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
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

                .product-info h3 {
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }

                .price-container {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .price {
                    font-weight: 700;
                    font-size: 1.1rem;
                }

                .compare-price {
                    text-decoration: line-through;
                    opacity: 0.5;
                    font-size: 0.9rem;
                }
            `}</style>
        </div>
    );
}

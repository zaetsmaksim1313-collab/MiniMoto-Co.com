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
                    <h1>Custom Mini Surrons</h1>
                    <hr className="hero-divider" />
                    <p>Create your very own mini Surron with working suspension, spinning wheels, and upgrades to choose from.</p>
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

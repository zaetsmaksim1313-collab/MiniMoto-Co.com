'use client';

import React from 'react';
import Link from 'next/link';

interface DecalShowcaseSectionProps {
    images?: string[];
}

export default function DecalShowcaseSection({ images = [] }: DecalShowcaseSectionProps) {
    const displayImages = images && images.length > 0 ? images : [
        "/custom 1.JPG",
        "/custom 2.JPG",
        "/custom 3.JPG",
        "/custom 4.JPG",
        "/custom 5.JPG"
    ];

    return (
        <section className="decal-showcase-section">
            <div className="container decal-showcase-inner">
                {/* Header Block */}
                <div className="decal-header-block">
                    <div className="decal-badge">
                        <span className="badge-sparkle">✦</span> 1-OF-1 BESPOKE DECAL LAB
                    </div>
                    <h2 className="decal-title">
                        BUILD YOUR 1/1 CUSTOM DECAL
                    </h2>
                    <p className="decal-description">
                        Personalize your front plate with custom racing numbers, your rider name, sponsor logos, and tailored colorways. Designed live in our 2D Decal Lab and precision-printed for only <strong>$5.00</strong>.
                    </p>
                    <div className="decal-cta-wrapper">
                        <Link href="/decal-builder" className="btn-decal-lab">
                            Enter Decal Lab ($5.00) &nbsp;→
                        </Link>
                    </div>
                </div>

                {/* Showcase Photo Grid */}
                <div className="decal-gallery-grid">
                    {displayImages.map((imgUrl, idx) => (
                        <div key={idx} className={`decal-gallery-card card-${idx}`}>
                            <div className="card-image-wrap">
                                <img src={imgUrl} alt={`Custom Decal Build ${idx + 1}`} className="card-img" />
                                <div className="card-overlay">
                                    <span className="card-tag">1/1 CUSTOM</span>
                                    <span className="card-cta">Design Yours →</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .decal-showcase-section {
                    position: relative;
                    background: #ffffff;
                    color: #000000;
                    padding: 6.5rem 0 6rem 0;
                    border-bottom: 1px solid #e4e4e7;
                    overflow: hidden;
                }

                .decal-showcase-inner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3.5rem;
                }

                .decal-header-block {
                    text-align: center;
                    max-width: 820px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.2rem;
                }

                .decal-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #f4f4f5;
                    border: 1px solid #e4e4e7;
                    border-radius: 999px;
                    padding: 6px 18px;
                    font-size: 0.72rem;
                    font-weight: 800;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #18181b;
                }

                .badge-sparkle {
                    color: #000000;
                }

                .decal-title {
                    font-size: clamp(2.2rem, 5.5vw, 4.2rem);
                    font-weight: 950;
                    letter-spacing: -0.03em;
                    text-transform: uppercase;
                    line-height: 1.05;
                    margin: 0;
                    color: #000000;
                }

                .decal-description {
                    font-size: clamp(0.95rem, 1.8vw, 1.15rem);
                    color: #52525b;
                    line-height: 1.65;
                    max-width: 680px;
                    margin: 0;
                }

                .decal-description strong {
                    color: #000000;
                }

                .decal-cta-wrapper {
                    margin-top: 0.5rem;
                }

                .btn-decal-lab {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.6rem;
                    padding: 16px 42px;
                    background: #000000;
                    color: #ffffff;
                    border-radius: 999px;
                    font-weight: 900;
                    font-size: 1rem;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
                }

                .btn-decal-lab:hover {
                    background: #27272a;
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.28);
                }

                /* Photo Grid */
                .decal-gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    width: 100%;
                }

                .decal-gallery-card {
                    position: relative;
                    border-radius: 14px;
                    overflow: hidden;
                    background: #f4f4f5;
                    border: 1px solid #e4e4e7;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
                    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                }

                .decal-gallery-card:hover {
                    transform: translateY(-6px);
                    border-color: #18181b;
                    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.14);
                }

                .card-image-wrap {
                    position: relative;
                    aspect-ratio: 4 / 3;
                    width: 100%;
                    overflow: hidden;
                }

                .card-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
                }

                .decal-gallery-card:hover .card-img {
                    transform: scale(1.08);
                }

                .card-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0,0,0,0.05) 60%, transparent 100%);
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    padding: 1.2rem;
                    opacity: 0.9;
                    transition: opacity 0.3s ease;
                }

                .card-tag {
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    background: rgba(255, 255, 255, 0.90);
                    color: #000000;
                    backdrop-filter: blur(8px);
                    padding: 4px 10px;
                    border-radius: 6px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }

                .card-cta {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #ffffff;
                    letter-spacing: 0.05em;
                }

                @media (max-width: 900px) {
                    .decal-gallery-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 550px) {
                    .decal-gallery-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </section>
    );
}

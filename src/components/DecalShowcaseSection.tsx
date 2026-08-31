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

    // Scattered rotation and offset classes for an organic editorial look
    const scatterStyles = [
        { rot: '-2.5deg', y: '0px', delay: '0s' },
        { rot: '2deg', y: '-14px', delay: '0.4s' },
        { rot: '-1.8deg', y: '8px', delay: '0.8s' },
        { rot: '2.5deg', y: '-8px', delay: '0.2s' },
        { rot: '-3deg', y: '12px', delay: '0.6s' },
        { rot: '1.5deg', y: '-10px', delay: '1s' },
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
                </div>

                {/* Scattered Square Photo Gallery */}
                <div className="decal-gallery-scattered">
                    {displayImages.map((imgUrl, idx) => {
                        const style = scatterStyles[idx % scatterStyles.length];
                        return (
                            <div
                                key={idx}
                                className="decal-card-scattered"
                                style={{
                                    '--init-rot': style.rot,
                                    '--init-y': style.y,
                                    '--anim-delay': style.delay,
                                } as React.CSSProperties}
                            >
                                <div className="card-square-wrap">
                                    <img src={imgUrl} alt={`Custom Decal ${idx + 1}`} className="card-square-img" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Big Bottom Action Button */}
                <div className="decal-bottom-cta">
                    <Link href="/decal-builder" className="btn-make-your-own">
                        MAKE YOUR OWN &nbsp;→
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .decal-showcase-section {
                    position: relative;
                    background: #ffffff;
                    color: #000000;
                    padding: 7rem 0 6.5rem 0;
                    border-bottom: 1px solid #e4e4e7;
                    overflow: hidden;
                }

                .decal-showcase-inner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4rem;
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

                /* Scattered Square Grid */
                .decal-gallery-scattered {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 2.2rem;
                    width: 100%;
                    max-width: 1180px;
                    padding: 1rem 0;
                }

                .decal-card-scattered {
                    position: relative;
                    transform: translateY(var(--init-y, 0px)) rotate(var(--init-rot, 0deg));
                    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                    animation: floatCard 4s ease-in-out infinite alternate;
                    animation-delay: var(--anim-delay, 0s);
                }

                @keyframes floatCard {
                    0% {
                        transform: translateY(var(--init-y, 0px)) rotate(var(--init-rot, 0deg));
                    }
                    100% {
                        transform: translateY(calc(var(--init-y, 0px) - 8px)) rotate(calc(var(--init-rot, 0deg) + 0.8deg));
                    }
                }

                .decal-card-scattered:hover {
                    animation-play-state: paused;
                    transform: translateY(-12px) scale(1.04) rotate(0deg) !important;
                    z-index: 10;
                }

                .card-square-wrap {
                    position: relative;
                    aspect-ratio: 1 / 1;
                    width: 100%;
                    border-radius: 16px;
                    overflow: hidden;
                    background: #f4f4f5;
                    border: 1.5px solid #e4e4e7;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                }

                .decal-card-scattered:hover .card-square-wrap {
                    border-color: #000000;
                    box-shadow: 0 22px 50px rgba(0, 0, 0, 0.16);
                }

                .card-square-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
                }

                .decal-card-scattered:hover .card-square-img {
                    transform: scale(1.06);
                }

                /* Big Bottom CTA Button */
                .decal-bottom-cta {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    padding-top: 0.5rem;
                }

                .btn-make-your-own {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px 54px;
                    background: #000000;
                    color: #ffffff;
                    border-radius: 999px;
                    font-weight: 900;
                    font-size: 1.15rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.22);
                }

                .btn-make-your-own:hover {
                    background: #27272a;
                    transform: translateY(-4px) scale(1.03);
                    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.32);
                }

                @media (max-width: 900px) {
                    .decal-gallery-scattered {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.5rem;
                    }
                }

                @media (max-width: 550px) {
                    .decal-gallery-scattered {
                        grid-template-columns: 1fr;
                        gap: 1.2rem;
                    }
                    .btn-make-your-own {
                        width: 100%;
                        padding: 18px 30px;
                        font-size: 1rem;
                    }
                }
            `}</style>
        </section>
    );
}

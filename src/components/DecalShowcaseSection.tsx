'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface DecalPair {
    designer: string;
    printed: string;
    title?: string;
}

interface DecalShowcaseSectionProps {
    images?: (string | DecalPair)[];
}

function BeforeAfterCard({ designerImg, printedImg, title, index }: { designerImg: string; printedImg: string; title: string; index: number }) {
    const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
        setSliderPos(percent);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length > 0) {
            handleMove(e.touches[0].clientX);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            handleMove(e.clientX);
        }
    };

    return (
        <div className="decal-compare-card">
            <div className="card-header-bar">
                <span className="build-badge">BUILD #{index + 1}</span>
                <div className="card-pill-labels">
                    <span className={`pill-label ${sliderPos > 50 ? 'active' : ''}`}>IN THE DESIGNER</span>
                    <span className="pill-dot">↔</span>
                    <span className={`pill-label ${sliderPos <= 50 ? 'active' : ''}`}>PRINTED OUT</span>
                </div>
            </div>

            {/* Interactive Before/After viewport */}
            <div
                ref={containerRef}
                className="compare-viewport"
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
            >
                {/* AFTER image: Printed Out (Bottom layer) */}
                <div className="img-layer printed-layer">
                    <img
                        src={printedImg}
                        alt={`Printed Build #${index + 1}`}
                        className="compare-img"
                    />
                    <span className="floating-badge badge-right">PRINTED OUT</span>
                </div>

                {/* BEFORE image: In the Designer (Top layer, clipped) */}
                <div
                    className="img-layer designer-layer"
                    style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                >
                    <img
                        src={designerImg}
                        alt={`In The Designer #${index + 1}`}
                        className="compare-img designer-img"
                    />
                    <span className="floating-badge badge-left">IN THE DESIGNER</span>
                </div>

                {/* Interactive Slider Divider Handle */}
                <div
                    className="slider-divider"
                    style={{ left: `${sliderPos}%` }}
                >
                    <div className="divider-line" />
                    <div className="divider-handle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Quick Toggle Controls */}
            <div className="card-quick-toggles">
                <button
                    type="button"
                    className={`toggle-btn ${sliderPos >= 90 ? 'btn-active' : ''}`}
                    onClick={() => setSliderPos(95)}
                >
                    In Designer
                </button>
                <button
                    type="button"
                    className={`toggle-btn ${sliderPos === 50 ? 'btn-active' : ''}`}
                    onClick={() => setSliderPos(50)}
                >
                    Split View
                </button>
                <button
                    type="button"
                    className={`toggle-btn ${sliderPos <= 10 ? 'btn-active' : ''}`}
                    onClick={() => setSliderPos(5)}
                >
                    Printed Out
                </button>
            </div>

            <style jsx>{`
                .decal-compare-card {
                    background: #ffffff;
                    border: 1.5px solid #e4e4e7;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
                    transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
                    display: flex;
                    flex-direction: column;
                }

                .decal-compare-card:hover {
                    border-color: #18181b;
                    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.12);
                    transform: translateY(-4px);
                }

                .card-header-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.25rem;
                    background: #fafafa;
                    border-bottom: 1px solid #f4f4f5;
                }

                .build-badge {
                    font-size: 0.72rem;
                    font-weight: 900;
                    letter-spacing: 0.08em;
                    color: #000000;
                }

                .card-pill-labels {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.68rem;
                    font-weight: 800;
                    letter-spacing: 0.06em;
                }

                .pill-label {
                    color: #a1a1aa;
                    transition: color 0.2s ease;
                }

                .pill-label.active {
                    color: #000000;
                }

                .pill-dot {
                    color: #d4d4d8;
                    font-size: 0.75rem;
                }

                /* Viewport */
                .compare-viewport {
                    position: relative;
                    aspect-ratio: 1 / 1;
                    width: 100%;
                    background: #f4f4f5;
                    overflow: hidden;
                    cursor: ew-resize;
                    user-select: none;
                    touch-action: none;
                }

                .img-layer {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                }

                .compare-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    image-rendering: -webkit-optimize-contrast;
                }

                .designer-img {
                    background: #fdfdfd;
                    object-fit: contain;
                    padding: 4%;
                }

                .floating-badge {
                    position: absolute;
                    bottom: 12px;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    pointer-events: none;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                }

                .badge-left {
                    left: 12px;
                    background: #000000;
                    color: #ffffff;
                }

                .badge-right {
                    right: 12px;
                    background: #ffffff;
                    color: #000000;
                }

                /* Slider divider line and handle */
                .slider-divider {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    transform: translateX(-50%);
                    pointer-events: none;
                    z-index: 20;
                }

                .divider-line {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 2px;
                    background: #ffffff;
                    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
                }

                .divider-handle {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 34px;
                    height: 34px;
                    background: #ffffff;
                    color: #000000;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
                    border: 2px solid #000000;
                }

                /* Quick Toggles */
                .card-quick-toggles {
                    display: flex;
                    padding: 0.75rem 1rem;
                    background: #ffffff;
                    gap: 0.5rem;
                    border-top: 1px solid #f4f4f5;
                }

                .toggle-btn {
                    flex: 1;
                    padding: 6px 0;
                    background: #f4f4f5;
                    color: #71717a;
                    border: none;
                    border-radius: 6px;
                    font-size: 0.72rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .toggle-btn:hover {
                    background: #e4e4e7;
                    color: #18181b;
                }

                .toggle-btn.btn-active {
                    background: #000000;
                    color: #ffffff;
                }
            `}</style>
        </div>
    );
}

export default function DecalShowcaseSection({ images = [] }: DecalShowcaseSectionProps) {
    const rawList = images.map(item => (typeof item === 'string' ? item : ''));

    // Default fallback sample pairs if nothing in DB yet
    const defaultPairs: DecalPair[] = [
        {
            designer: "/custom 1.JPG",
            printed: "/custom 2.JPG",
            title: "Custom Build #1",
        },
        {
            designer: "/custom 3.JPG",
            printed: "/custom 4.JPG",
            title: "Custom Build #2",
        },
        {
            designer: "/custom 5.JPG",
            printed: "/custom 1.JPG",
            title: "Custom Build #3",
        },
        {
            designer: "/custom 2.JPG",
            printed: "/custom 3.JPG",
            title: "Custom Build #4",
        }
    ];

    const pairs: DecalPair[] = [];
    if (rawList.length >= 8) {
        pairs.push(
            { designer: rawList[0] || defaultPairs[0].designer, printed: rawList[1] || defaultPairs[0].printed, title: "Build #1" },
            { designer: rawList[2] || defaultPairs[1].designer, printed: rawList[3] || defaultPairs[1].printed, title: "Build #2" },
            { designer: rawList[4] || defaultPairs[2].designer, printed: rawList[5] || defaultPairs[2].printed, title: "Build #3" },
            { designer: rawList[6] || defaultPairs[3].designer, printed: rawList[7] || defaultPairs[3].printed, title: "Build #4" }
        );
    } else if (rawList.length >= 2) {
        for (let i = 0; i < 4; i++) {
            pairs.push({
                designer: rawList[i * 2] || defaultPairs[i].designer,
                printed: rawList[i * 2 + 1] || defaultPairs[i].printed,
                title: `Build #${i + 1}`,
            });
        }
    } else {
        pairs.push(...defaultPairs);
    }

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
                        From your live digital design to race-ready reality. Drag the slider on any build below to compare the design <strong>In the Designer</strong> vs <strong>Printed Out</strong> on the bike.
                    </p>
                </div>

                {/* 4 Before & After Interactive Sliders */}
                <div className="decal-pairs-grid">
                    {pairs.slice(0, 4).map((pair, idx) => (
                        <BeforeAfterCard
                            key={idx}
                            index={idx}
                            title={pair.title || `Build #${idx + 1}`}
                            designerImg={pair.designer}
                            printedImg={pair.printed}
                        />
                    ))}
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

                /* 4-Item Grid */
                .decal-pairs-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                    width: 100%;
                    max-width: 1280px;
                }

                @media (max-width: 1100px) {
                    .decal-pairs-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.5rem;
                    }
                }

                @media (max-width: 600px) {
                    .decal-pairs-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
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

                @media (max-width: 550px) {
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

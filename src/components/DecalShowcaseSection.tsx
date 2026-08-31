'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface DecalPair {
    designer: string;
    printed: string;
}

interface DecalShowcaseSectionProps {
    images?: any[];
}

export default function DecalShowcaseSection({ images = [] }: DecalShowcaseSectionProps) {
    const rawList = images.map(item => (typeof item === 'string' ? item : ''));

    // Fallback sample pairs if not yet populated in DB
    const defaultPairs: DecalPair[] = [
        { designer: "/custom 1.JPG", printed: "/custom 2.JPG" },
        { designer: "/custom 3.JPG", printed: "/custom 4.JPG" },
        { designer: "/custom 5.JPG", printed: "/custom 1.JPG" },
        { designer: "/custom 2.JPG", printed: "/custom 3.JPG" }
    ];

    const pairs: DecalPair[] = [];
    if (rawList.length >= 8) {
        pairs.push(
            { designer: rawList[0] || defaultPairs[0].designer, printed: rawList[1] || defaultPairs[0].printed },
            { designer: rawList[2] || defaultPairs[1].designer, printed: rawList[3] || defaultPairs[1].printed },
            { designer: rawList[4] || defaultPairs[2].designer, printed: rawList[5] || defaultPairs[2].printed },
            { designer: rawList[6] || defaultPairs[3].designer, printed: rawList[7] || defaultPairs[3].printed }
        );
    } else if (rawList.length >= 2) {
        for (let i = 0; i < 4; i++) {
            pairs.push({
                designer: rawList[i * 2] || defaultPairs[i].designer,
                printed: rawList[i * 2 + 1] || defaultPairs[i].printed,
            });
        }
    } else {
        pairs.push(...defaultPairs);
    }

    const [activeIdx, setActiveIdx] = useState(0);
    const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentPair = pairs[activeIdx] || defaultPairs[0];

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
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

    const prevBuild = () => {
        setActiveIdx((prev) => (prev === 0 ? pairs.length - 1 : prev - 1));
        setSliderPos(50);
    };

    const nextBuild = () => {
        setActiveIdx((prev) => (prev === pairs.length - 1 ? 0 : prev + 1));
        setSliderPos(50);
    };

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

                {/* ── SINGLE UNIFIED MASTER COMPARISON SLIDER ── */}
                <div className="master-slider-container">
                    {/* Top Side Labels */}
                    <div className="slider-side-headers">
                        <div className="side-label side-left">
                            <span className="dot dot-left" />
                            <strong>IN THE DESIGNER</strong>
                        </div>
                        <div className="side-hint">← Drag center handle to compare →</div>
                        <div className="side-label side-right">
                            <strong>PRINTED OUT</strong>
                            <span className="dot dot-right" />
                        </div>
                    </div>

                    {/* Interactive Comparison Stage */}
                    <div
                        ref={containerRef}
                        className="master-compare-viewport"
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                        onMouseMove={handleMouseMove}
                        onTouchMove={handleTouchMove}
                    >
                        {/* RIGHT LAYER: PRINTED OUT (On Bike) */}
                        <div className="compare-layer layer-printed">
                            <img
                                src={currentPair.printed}
                                alt="Printed Out On Bike"
                                className="compare-photo"
                            />
                            <div className="corner-tag tag-right">PRINTED OUT</div>
                        </div>

                        {/* LEFT LAYER: IN THE DESIGNER (Decal Graphic) */}
                        <div
                            className="compare-layer layer-designer"
                            style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                        >
                            <img
                                src={currentPair.designer}
                                alt="In The Designer Decal"
                                className="compare-photo designer-photo"
                            />
                            <div className="corner-tag tag-left">IN THE DESIGNER</div>
                        </div>

                        {/* Interactive Center Draggable Handle */}
                        <div
                            className="slider-handle-divider"
                            style={{ left: `${sliderPos}%` }}
                        >
                            <div className="divider-bar" />
                            <div className="drag-knob">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Build Switcher Row */}
                    <div className="build-switcher-row">
                        <button
                            type="button"
                            onClick={prevBuild}
                            className="nav-arrow-btn"
                            title="Previous Build"
                        >
                            ←
                        </button>

                        <div className="build-thumbs-track">
                            {pairs.map((p, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setActiveIdx(idx);
                                        setSliderPos(50);
                                    }}
                                    className={`build-thumb-card ${activeIdx === idx ? 'thumb-active' : ''}`}
                                >
                                    <div className="thumb-split">
                                        <img src={p.designer} alt={`Design ${idx + 1}`} className="thumb-img-left" />
                                        <img src={p.printed} alt={`Printed ${idx + 1}`} className="thumb-img-right" />
                                    </div>
                                    <span className="thumb-label">
                                        {activeIdx === idx ? 'Viewing' : `Custom ${idx + 1}`}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={nextBuild}
                            className="nav-arrow-btn"
                            title="Next Build"
                        >
                            →
                        </button>
                    </div>
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

                /* Master Slider Stage */
                .master-slider-container {
                    width: 100%;
                    max-width: 920px;
                    display: flex;
                    flex-direction: column;
                    gap: 1.2rem;
                }

                .slider-side-headers {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 0.5rem;
                }

                .side-label {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.82rem;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .side-left {
                    color: #000000;
                }

                .side-right {
                    color: #000000;
                }

                .side-hint {
                    font-size: 0.75rem;
                    color: #a1a1aa;
                    font-weight: 600;
                }

                .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }

                .dot-left {
                    background: #000000;
                }

                .dot-right {
                    background: #71717a;
                }

                /* Viewport */
                .master-compare-viewport {
                    position: relative;
                    aspect-ratio: 16 / 10;
                    min-height: 380px;
                    width: 100%;
                    background: #f4f4f5;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 2px solid #18181b;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.14);
                    cursor: ew-resize;
                    user-select: none;
                    touch-action: none;
                }

                .compare-layer {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                }

                .compare-photo {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    image-rendering: -webkit-optimize-contrast;
                }

                .designer-photo {
                    background: #fcfcfc;
                    object-fit: contain;
                    padding: 4%;
                }

                .corner-tag {
                    position: absolute;
                    bottom: 16px;
                    padding: 6px 14px;
                    border-radius: 8px;
                    font-size: 0.72rem;
                    font-weight: 900;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    pointer-events: none;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
                }

                .tag-left {
                    left: 16px;
                    background: #000000;
                    color: #ffffff;
                }

                .tag-right {
                    right: 16px;
                    background: #ffffff;
                    color: #000000;
                }

                /* Center Draggable Slider Line */
                .slider-handle-divider {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    transform: translateX(-50%);
                    pointer-events: none;
                    z-index: 30;
                }

                .divider-bar {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 3px;
                    background: #ffffff;
                    box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
                }

                .drag-knob {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 44px;
                    height: 44px;
                    background: #ffffff;
                    color: #000000;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
                    border: 2.5px solid #000000;
                }

                /* Thumbnail Switcher Track */
                .build-switcher-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 0.5rem;
                }

                .nav-arrow-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: #f4f4f5;
                    border: 1.5px solid #e4e4e7;
                    font-size: 1.2rem;
                    font-weight: 800;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }

                .nav-arrow-btn:hover {
                    background: #000000;
                    color: #ffffff;
                    border-color: #000000;
                }

                .build-thumbs-track {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 0.8rem;
                    flex: 1;
                }

                .build-thumb-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 6px;
                    border-radius: 12px;
                    background: #f4f4f5;
                    border: 2px solid transparent;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }

                .build-thumb-card:hover {
                    border-color: #a1a1aa;
                }

                .build-thumb-card.thumb-active {
                    background: #ffffff;
                    border-color: #000000;
                    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
                }

                .thumb-split {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    width: 100%;
                    aspect-ratio: 2 / 1;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #e4e4e7;
                }

                .thumb-img-left {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    background: #fff;
                    padding: 2px;
                }

                .thumb-img-right {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .thumb-label {
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: #18181b;
                    letter-spacing: 0.04em;
                }

                /* Big Bottom Action Button */
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

                @media (max-width: 650px) {
                    .master-compare-viewport {
                        aspect-ratio: 1 / 1;
                        min-height: auto;
                    }
                    .side-hint {
                        display: none;
                    }
                    .build-thumbs-track {
                        grid-template-columns: repeat(2, 1fr);
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

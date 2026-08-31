'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface DecalShowcaseSectionProps {
    images?: any[];
}

export default function DecalShowcaseSection({ images = [] }: DecalShowcaseSectionProps) {
    const rawList = images.map(item => (typeof item === 'string' ? item : ''));

    // Fallback sample photos
    const defaultDesigner = ["/custom 1.JPG", "/custom 3.JPG", "/custom 5.JPG", "/custom 2.JPG"];
    const defaultPrinted = ["/custom 2.JPG", "/custom 4.JPG", "/custom 1.JPG", "/custom 3.JPG"];

    // Match the 4 designer photos and the 4 printed bike photos from the user's uploaded images
    let designerPhotos: string[] = [];
    let printedPhotos: string[] = [];

    if (rawList.length >= 8) {
        // If uploaded in [d1, d2, p1, p2, p3, d3, d4, p4] order from admin
        designerPhotos = [
            rawList[0] || defaultDesigner[0],
            rawList[1] || defaultDesigner[1],
            rawList[5] || rawList[2] || defaultDesigner[2],
            rawList[6] || rawList[3] || defaultDesigner[3],
        ];
        printedPhotos = [
            rawList[2] || defaultPrinted[0],
            rawList[3] || defaultPrinted[1],
            rawList[4] || defaultPrinted[2],
            rawList[7] || defaultPrinted[3],
        ];
    } else {
        designerPhotos = defaultDesigner;
        printedPhotos = defaultPrinted;
    }

    const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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

                {/* ── UNIFIED 4-BUILD SLIDER COMPARISON CONTAINER ── */}
                <div className="showcase-slider-wrapper">
                    {/* Header Side Labels */}
                    <div className="slider-top-labels">
                        <div className="label-side left">
                            <span className="dot dot-dark" />
                            <strong>IN THE DESIGNER</strong>
                        </div>
                        <div className="label-instruction">
                            ← Drag center slider to reveal printed bikes →
                        </div>
                        <div className="label-side right">
                            <strong>PRINTED OUT</strong>
                            <span className="dot dot-gray" />
                        </div>
                    </div>

                    {/* Interactive 4-Card Wipe Viewport */}
                    <div
                        ref={containerRef}
                        className="multi-compare-viewport"
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                        onMouseMove={handleMouseMove}
                        onTouchMove={handleTouchMove}
                    >
                        {/* UNDER LAYER: 4 PRINTED ON BIKE PHOTOS */}
                        <div className="multi-grid-layer printed-layer">
                            {printedPhotos.map((imgUrl, idx) => (
                                <div key={idx} className="square-photo-card">
                                    <img
                                        src={imgUrl}
                                        alt={`Printed Bike ${idx + 1}`}
                                        className="square-img printed-img"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* TOP LAYER: 4 IN THE DESIGNER PHOTOS (CLIPPED BY SLIDER) */}
                        <div
                            className="multi-grid-layer designer-layer"
                            style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                        >
                            {designerPhotos.map((imgUrl, idx) => (
                                <div key={idx} className="square-photo-card designer-card">
                                    <img
                                        src={imgUrl}
                                        alt={`Designer Decal ${idx + 1}`}
                                        className="square-img designer-img"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* ONE SINGLE BIG DRAGGABLE SLIDER DIVIDER */}
                        <div
                            className="master-slider-bar"
                            style={{ left: `${sliderPos}%` }}
                        >
                            <div className="bar-line" />
                            <div className="bar-handle">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </div>
                        </div>
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

                /* Showcase Slider Container */
                .showcase-slider-wrapper {
                    width: 100%;
                    max-width: 1240px;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .slider-top-labels {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 0.5rem;
                }

                .label-side {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #000000;
                }

                .label-instruction {
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: #71717a;
                }

                .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }

                .dot-dark {
                    background: #000000;
                }

                .dot-gray {
                    background: #71717a;
                }

                /* Multi-Card Comparison Viewport */
                .multi-compare-viewport {
                    position: relative;
                    width: 100%;
                    background: #ffffff;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 2px solid #18181b;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
                    cursor: ew-resize;
                    user-select: none;
                    touch-action: none;
                }

                .multi-grid-layer {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.25rem;
                    padding: 1.25rem;
                    width: 100%;
                    background: #ffffff;
                }

                .designer-layer {
                    position: absolute;
                    inset: 0;
                    background: #ffffff;
                }

                .square-photo-card {
                    position: relative;
                    aspect-ratio: 1 / 1;
                    width: 100%;
                    border-radius: 14px;
                    overflow: hidden;
                    background: #f4f4f5;
                    border: 1.5px solid #e4e4e7;
                    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
                }

                .designer-card {
                    background: #ffffff;
                }

                .square-img {
                    width: 100%;
                    height: 100%;
                    display: block;
                    image-rendering: -webkit-optimize-contrast;
                }

                .printed-img {
                    object-fit: cover;
                }

                .designer-img {
                    object-fit: contain;
                    padding: 4%;
                }

                /* Master Slider Center Divider */
                .master-slider-bar {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    transform: translateX(-50%);
                    pointer-events: none;
                    z-index: 40;
                }

                .bar-line {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 4px;
                    background: #ffffff;
                    box-shadow: 0 0 16px rgba(0, 0, 0, 0.6);
                }

                .bar-handle {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 48px;
                    height: 48px;
                    background: #ffffff;
                    color: #000000;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
                    border: 3px solid #000000;
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

                @media (max-width: 950px) {
                    .multi-grid-layer {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                        padding: 1rem;
                    }
                    .label-instruction {
                        display: none;
                    }
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

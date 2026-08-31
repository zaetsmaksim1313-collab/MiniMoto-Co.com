'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface DecalShowcaseSectionProps {
    images?: any[];
}

export default function DecalShowcaseSection({ images = [] }: DecalShowcaseSectionProps) {
    const rawList = images.map(item => (typeof item === 'string' ? item : ''));

    // 2 Decal designs and 2 corresponding Bike photos
    const defaultDecals = ["/custom 1.JPG", "/custom 3.JPG"];
    const defaultBikes = ["/custom 2.JPG", "/custom 4.JPG"];

    let decal1 = defaultDecals[0];
    let decal2 = defaultDecals[1];
    let bike1 = defaultBikes[0];
    let bike2 = defaultBikes[1];

    if (rawList.length >= 8) {
        decal1 = rawList[0] || defaultDecals[0];
        bike1 = rawList[2] || defaultBikes[0];
        decal2 = rawList[1] || defaultDecals[1];
        bike2 = rawList[3] || defaultBikes[1];
    } else if (rawList.length >= 4) {
        decal1 = rawList[0] || defaultDecals[0];
        bike1 = rawList[1] || defaultBikes[0];
        decal2 = rawList[2] || defaultDecals[1];
        bike2 = rawList[3] || defaultBikes[1];
    } else if (rawList.length >= 2) {
        decal1 = rawList[0] || defaultDecals[0];
        bike1 = rawList[1] || defaultBikes[0];
    }

    const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateSlider = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPos(percent);
    }, []);

    // Global drag event listeners so dragging is buttery smooth across the whole screen
    useEffect(() => {
        const handleGlobalMove = (e: MouseEvent) => {
            if (!isDragging) return;
            e.preventDefault();
            updateSlider(e.clientX);
        };

        const handleGlobalTouchMove = (e: TouchEvent) => {
            if (!isDragging || e.touches.length === 0) return;
            updateSlider(e.touches[0].clientX);
        };

        const handleGlobalEnd = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMove, { passive: false });
            window.addEventListener('mouseup', handleGlobalEnd);
            window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
            window.addEventListener('touchend', handleGlobalEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalEnd);
            window.removeEventListener('touchmove', handleGlobalTouchMove);
            window.removeEventListener('touchend', handleGlobalEnd);
        };
    }, [isDragging, updateSlider]);

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        setIsDragging(true);
        updateSlider(e.clientX);
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

                {/* ── UNIFIED 2-BUILD STACKED SLIDER SHOWCASE ── */}
                <div className="stacked-slider-wrapper">
                    {/* Header Side Labels */}
                    <div className="slider-top-labels">
                        <div className="label-side left">
                            <span className="dot dot-dark" />
                            <strong>IN THE DESIGNER</strong>
                        </div>
                        <div className="label-instruction">
                            ← Drag slider to reveal printed bikes →
                        </div>
                        <div className="label-side right">
                            <strong>PRINTED OUT</strong>
                            <span className="dot dot-gray" />
                        </div>
                    </div>

                    {/* Interactive Stacked Wipe Viewport */}
                    <div
                        ref={containerRef}
                        className="stacked-compare-viewport"
                        onPointerDown={handlePointerDown}
                        style={{ cursor: isDragging ? 'grabbing' : 'ew-resize' }}
                    >
                        {/* UNDER LAYER: 2 STACKED PRINTED BIKE PHOTOS */}
                        <div className="stacked-layer bikes-layer">
                            <div className="stacked-card card-top">
                                <img
                                    src={bike1}
                                    alt="Printed Bike Build 1"
                                    className="stacked-img bike-img"
                                    draggable={false}
                                />
                            </div>
                            <div className="stacked-card card-bottom">
                                <img
                                    src={bike2}
                                    alt="Printed Bike Build 2"
                                    className="stacked-img bike-img"
                                    draggable={false}
                                />
                            </div>
                        </div>

                        {/* TOP LAYER: 2 STACKED IN THE DESIGNER DECALS (CLIPPED BY SLIDER) */}
                        <div
                            className="stacked-layer decals-layer"
                            style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                        >
                            <div className="stacked-card card-top decal-card">
                                <img
                                    src={decal1}
                                    alt="Designer Decal 1"
                                    className="stacked-img decal-img"
                                    draggable={false}
                                />
                            </div>
                            <div className="stacked-card card-bottom decal-card">
                                <img
                                    src={decal2}
                                    alt="Designer Decal 2"
                                    className="stacked-img decal-img"
                                    draggable={false}
                                />
                            </div>
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

                /* Stacked Showcase Slider */
                .stacked-slider-wrapper {
                    width: 100%;
                    max-width: 680px;
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

                /* Stacked Viewport */
                .stacked-compare-viewport {
                    position: relative;
                    width: 100%;
                    height: 640px;
                    background: #ffffff;
                    border-radius: 24px;
                    overflow: hidden;
                    border: 2px solid #18181b;
                    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.12);
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: none;
                }

                .stacked-layer {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                    padding: 2rem;
                    background: #ffffff;
                    pointer-events: none;
                    user-select: none;
                    -webkit-user-select: none;
                }

                .decals-layer {
                    z-index: 10;
                }

                .stacked-card {
                    position: relative;
                    width: 320px;
                    aspect-ratio: 1 / 1;
                    border-radius: 18px;
                    overflow: hidden;
                    background: #f4f4f5;
                    border: 1.5px solid #e4e4e7;
                    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.08);
                    pointer-events: none;
                    user-select: none;
                    -webkit-user-select: none;
                }

                /* Staggered overlapping stack */
                .card-top {
                    transform: rotate(-2.5deg) translateX(-18px);
                    z-index: 1;
                }

                .card-bottom {
                    transform: rotate(2.5deg) translateX(18px) translateY(-25px);
                    z-index: 2;
                }

                .decal-card {
                    background: #ffffff;
                }

                .stacked-img {
                    width: 100%;
                    height: 100%;
                    display: block;
                    image-rendering: -webkit-optimize-contrast;
                    pointer-events: none;
                    user-select: none;
                    -webkit-user-select: none;
                    -webkit-user-drag: none;
                }

                .bike-img {
                    object-fit: cover;
                }

                .decal-img {
                    object-fit: contain;
                    padding: 6%;
                }

                /* Master Slider Divider */
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

                .drag-knob {
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

                @media (max-width: 650px) {
                    .stacked-compare-viewport {
                        height: 520px;
                    }
                    .stacked-card {
                        width: 240px;
                    }
                    .card-top {
                        transform: rotate(-2deg) translateX(-10px);
                    }
                    .card-bottom {
                        transform: rotate(2deg) translateX(10px) translateY(-18px);
                    }
                    .label-instruction {
                        display: none;
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

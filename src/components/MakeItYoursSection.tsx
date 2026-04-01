'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface MakeItYoursSectionProps {
    images: string[];
}

export default function MakeItYoursSection({ images }: MakeItYoursSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            setMousePos({ x, y });
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Provide default layout metrics for desktop "chaos"
    // Using percentages so they scale with screen width
    const imageStyles = [
        { top: '15%', left: '10%', width: '22%', aspectRatio: '4/5', zIndex: 2, parallax: 0.04 },
        { top: '5%', left: '60%', width: '25%', aspectRatio: '16/9', zIndex: 1, parallax: -0.02 },
        { top: '55%', left: '5%', width: '18%', aspectRatio: '1/1', zIndex: 3, parallax: -0.05 },
        { top: '50%', left: '70%', width: '22%', aspectRatio: '3/4', zIndex: 4, parallax: 0.03 },
        { top: '75%', left: '45%', width: '24%', aspectRatio: '16/10', zIndex: 2, parallax: -0.03 },
    ];

    if (!images || images.length === 0) return null;

    // Use only max 5 images to map to our 5 layout positions
    const displayImages = images.slice(0, 5);

    return (
        <section className="make-it-yours-container" ref={sectionRef}>
            <div className="center-text-wrapper">
                <h1 className="center-text">MAKE IT<br/>YOURS</h1>
                <p className="center-subtext">Build Your Own Mini Moto</p>
            </div>

            <div className="collage-grid-mobile">
                {displayImages.map((src, i) => (
                    <div key={i} className="mobile-img-wrapper" style={{ aspectRatio: imageStyles[i]?.aspectRatio || '1/1' }}>
                        <Image src={src} alt="Custom Moto Build" fill style={{ objectFit: 'cover' }} />
                    </div>
                ))}
            </div>

            <div className="collage-desktop">
                {displayImages.map((src, i) => {
                    const s = imageStyles[i];
                    if (!s) return null;
                    const transformX = mousePos.x * s.parallax * 1000;
                    const transformY = mousePos.y * s.parallax * 1000;

                    return (
                        <div 
                            key={i} 
                            className="floating-image" 
                            style={{
                                top: s.top,
                                left: s.left,
                                width: s.width,
                                aspectRatio: s.aspectRatio,
                                zIndex: s.zIndex,
                                transform: `translate(${transformX}px, ${transformY}px)`
                            }}
                        >
                            <Image 
                                src={src} 
                                alt="Custom Moto" 
                                fill 
                                sizes="(max-width: 768px) 100vw, 30vw"
                                style={{ objectFit: 'cover' }} 
                            />
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                .make-it-yours-container {
                    position: relative;
                    width: 100%;
                    min-height: 80vh;
                    background: #ffffff;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 1rem;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }

                .center-text-wrapper {
                    text-align: center;
                    position: relative;
                    z-index: 10;
                    pointer-events: none;
                }

                .center-text {
                    font-size: clamp(4rem, 10vw, 10rem);
                    font-weight: 900;
                    line-height: 0.85;
                    margin: 0;
                    color: #000;
                    letter-spacing: -0.04em;
                    text-transform: uppercase;
                }

                .center-subtext {
                    font-size: clamp(1rem, 2vw, 1.5rem);
                    font-weight: 500;
                    margin-top: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    opacity: 0.7;
                }

                .collage-desktop {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                }

                .collage-grid-mobile {
                    display: none;
                }

                .floating-image {
                    position: absolute;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05);
                    transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                    pointer-events: auto;
                }

                .floating-image::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.03);
                    pointer-events: none;
                    transition: background 0.4s ease;
                }

                .floating-image:hover {
                    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    transform: scale(1.05) !important;
                    z-index: 20 !important;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.15), 0 2px 5px rgba(0,0,0,0.05);
                }
                .floating-image:hover::after {
                    background: rgba(0,0,0,0);
                }

                /* Mobile Layout - Switch from absolute chaos to ordered staggered columns */
                @media (max-width: 768px) {
                    .make-it-yours-container {
                        min-height: auto;
                        flex-direction: column;
                        padding: 6rem 1rem 4rem 1rem;
                    }
                    
                    .collage-desktop {
                        display: none;
                    }

                    .collage-grid-mobile {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                        width: 100%;
                        margin-top: 3rem;
                    }

                    .mobile-img-wrapper {
                        position: relative;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.08);
                    }

                    .mobile-img-wrapper:nth-child(3) {
                        grid-column: span 2;
                        aspect-ratio: 16/9 !important;
                    }

                    .mobile-img-wrapper:nth-child(even) {
                        transform: translateY(2rem);
                    }
                }
            `}</style>
        </section>
    );
}

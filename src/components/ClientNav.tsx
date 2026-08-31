"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import CartIcon from "@/components/CartIcon";

export default function ClientNav({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isCheckout = pathname === '/checkout';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [motosDropdownOpen, setMotosDropdownOpen] = useState(false);

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setMotosDropdownOpen(false);
    };

    return (
        <>
            <style>{`
                .nav-dropdown-parent:hover .nav-dropdown {
                    display: flex !important;
                }
                .mobile-menu-btn { display: none; }
                .nav-links { display: flex; gap: 2rem; }
                .nav-container { display: grid; grid-template-columns: 1fr auto 1fr; width: 100%; }
                
                @media (max-width: 900px) {
                    .nav-links { display: none !important; }
                    .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; cursor: pointer; background: transparent; border: none; color: #fff; padding: 4px; }
                    .nav-container { display: flex !important; justify-content: space-between !important; padding: 0.6rem 1rem !important; }
                    .nav-title { font-size: 1.05rem !important; margin: 0 !important; }
                    .nav-actions { gap: 1rem !important; }
                    .usd-text { display: none !important; }
                }

                /* Mobile Drawer */
                .mobile-drawer {
                    position: fixed;
                    top: 65px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: #000000;
                    z-index: 999;
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem 1.5rem 3rem 1.5rem;
                    gap: 1.2rem;
                    overflow-y: auto;
                    border-top: 1px solid #222;
                    transform: translateY(-100%);
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
                }

                .mobile-drawer.open {
                    transform: translateY(0);
                    opacity: 1;
                    pointer-events: auto;
                }

                .mobile-nav-item {
                    font-size: 1.1rem;
                    font-weight: 800;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid #1a1a1a;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .mobile-subnav {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                    padding: 0.5rem 0 0.8rem 1.2rem;
                }

                .mobile-subnav a {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #a1a1aa;
                    text-decoration: none;
                }
            `}</style>
            {!isCheckout && (
                <header style={{ position: 'sticky', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#000', color: '#fff', borderBottom: '1px solid #222' }}>
                    <nav className="container nav-container" style={{ alignItems: 'center', padding: '1rem 1.5rem' }}>
                        {/* Hamburger Button */}
                        <button
                            type="button"
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle Navigation Menu"
                        >
                            {mobileMenuOpen ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            )}
                        </button>

                        {/* Desktop Nav Links */}
                        <ul className="nav-links" style={{ fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', margin: 0, padding: 0, listStyle: 'none' }}>
                            <li><Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>HOME</Link></li>
                            <li className="nav-dropdown-parent" style={{ position: 'relative', padding: '1rem 0', margin: '-1rem 0' }}>
                                <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#fff', textDecoration: 'none' }}>MINI MOTOS</a>
                                <ul className="nav-dropdown" style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: '#000', listStyle: 'none', padding: '1rem', margin: 0, display: 'none', flexDirection: 'column', gap: '1rem', border: '1px solid #333', minWidth: '200px', zIndex: 1000, borderRadius: '8px' }}>
                                    <li><Link href="/products?category=Mini%20Motos" style={{ color: '#fff', textDecoration: 'none' }}>MINI MOTOS</Link></li>
                                    <li><Link href="/products?category=Emotos" style={{ color: '#fff', textDecoration: 'none' }}>EMOTOS</Link></li>
                                    <li><Link href="/products?category=E%20Bikes" style={{ color: '#fff', textDecoration: 'none' }}>E BIKES</Link></li>
                                    <li><Link href="/products?category=E%20Scooters" style={{ color: '#fff', textDecoration: 'none' }}>E SCOOTERS</Link></li>
                                    <li><Link href="/products?category=Pedal%20Bikes" style={{ color: '#fff', textDecoration: 'none' }}>PEDAL BIKES</Link></li>
                                </ul>
                            </li>
                            <li><Link href="/decal-builder" style={{ color: '#fff', textDecoration: 'none' }}>DECAL LAB</Link></li>
                            <li><Link href="/products?category=Prebuilts" style={{ color: '#fff', textDecoration: 'none' }}>PREBUILTS</Link></li>
                        </ul>

                        {/* Brand Logo Wordmark */}
                        <div className="nav-title" style={{ fontSize: '1.2rem', fontWeight: '900', fontFamily: 'var(--font-heading)', textAlign: 'center', margin: '0 1rem', whiteSpace: 'nowrap' }}>
                            <Link href="/" style={{ color: '#fff', textDecoration: 'none', letterSpacing: '-0.02em' }}>
                                MINIMOTO<span style={{ color: '#fff' }}>&amp;</span>CO
                            </Link>
                        </div>

                        {/* Actions */}
                        <div className="nav-actions" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', justifyContent: 'flex-end', fontSize: '0.9rem', fontWeight: '800' }}>
                            <span className="usd-text" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>USD</span>
                            <Link href="/search" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </Link>
                            <CartIcon />
                        </div>
                    </nav>

                    {/* Mobile Slide-Down Drawer */}
                    <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
                        <Link href="/" onClick={closeMobileMenu} className="mobile-nav-item">
                            HOME
                        </Link>
                        
                        <div>
                            <div
                                onClick={() => setMotosDropdownOpen(!motosDropdownOpen)}
                                className="mobile-nav-item"
                                style={{ cursor: 'pointer' }}
                            >
                                <span>MINI MOTOS</span>
                                <span>{motosDropdownOpen ? '−' : '+'}</span>
                            </div>
                            {motosDropdownOpen && (
                                <div className="mobile-subnav">
                                    <Link href="/products?category=Mini%20Motos" onClick={closeMobileMenu}>• MINI MOTOS</Link>
                                    <Link href="/products?category=Emotos" onClick={closeMobileMenu}>• EMOTOS</Link>
                                    <Link href="/products?category=E%20Bikes" onClick={closeMobileMenu}>• E BIKES</Link>
                                    <Link href="/products?category=E%20Scooters" onClick={closeMobileMenu}>• E SCOOTERS</Link>
                                    <Link href="/products?category=Pedal%20Bikes" onClick={closeMobileMenu}>• PEDAL BIKES</Link>
                                </div>
                            )}
                        </div>

                        <Link href="/decal-builder" onClick={closeMobileMenu} className="mobile-nav-item">
                            🎨 1/1 DECAL LAB
                        </Link>

                        <Link href="/products?category=Prebuilts" onClick={closeMobileMenu} className="mobile-nav-item">
                            PREBUILTS
                        </Link>

                        <Link href="/products" onClick={closeMobileMenu} className="mobile-nav-item">
                            SHOP ALL BIKES
                        </Link>

                        <Link href="/search" onClick={closeMobileMenu} className="mobile-nav-item">
                            🔍 SEARCH
                        </Link>
                    </div>
                </header>
            )}
            <main style={{ marginTop: 0, minHeight: '80vh', overflowX: 'hidden' }}>
                {children}
            </main>
            {!isCheckout && (
                <footer style={{ marginTop: '4rem', padding: '4rem 1.5rem', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.08)', background: '#ffffff' }}>
                    <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h2 style={{ color: '#000000', marginBottom: '0.8rem', fontSize: '1.4rem', fontWeight: 900 }}>MINIMOTO&amp;CO</h2>
                        <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '1.8rem', lineHeight: 1.5 }}>The highest quality mini motos on the market. Hand-built in San Diego, CA.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', fontWeight: 700, fontSize: '0.88rem' }}>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                            <a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>© {new Date().getFullYear()} MINIMOTO&amp;CO. ALL RIGHTS RESERVED.</p>
                    </div>
                </footer>
            )}
        </>
    );
}

"use client";

import { usePathname } from "next/navigation";
import CartIcon from "@/components/CartIcon";

export default function ClientNav({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isCheckout = pathname === '/checkout';

    return (
        <>
            <style>{`
                .nav-dropdown-parent:hover .nav-dropdown {
                    display: flex !important;
                }
                .mobile-menu-btn { display: none; }
                .nav-links { display: flex; gap: 2rem; }
                .nav-container { display: grid; grid-template-columns: 1fr auto 1fr; }
                
                @media (max-width: 900px) {
                    .nav-links { display: none !important; }
                    .mobile-menu-btn { display: block !important; cursor: pointer; }
                    .nav-container { display: flex !important; justify-content: space-between !important; padding: 0.5rem 0; }
                    .nav-title { font-size: 1rem !important; }
                    .nav-actions { gap: 1rem !important; }
                    .usd-text { display: none !important; }
                }
            `}</style>
            {!isCheckout && (
                <header style={{ position: 'relative', width: '100%', zIndex: 1000, padding: '1.5rem 0', backgroundColor: '#000', color: '#fff', borderBottom: '1px solid #333' }}>
                    <nav className="container nav-container" style={{ alignItems: 'center' }}>
                        <div className="mobile-menu-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </div>
                        <ul className="nav-links" style={{ fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', margin: 0, padding: 0, listStyle: 'none' }}>
                            <li><a href="/" style={{ color: '#fff', textDecoration: 'none' }}>HOME</a></li>
                            <li className="nav-dropdown-parent" style={{ position: 'relative', padding: '1rem 0', margin: '-1rem 0' }}>
                                <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#fff', textDecoration: 'none' }}>MINI MOTOS</a>
                                <ul className="nav-dropdown" style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: '#000', listStyle: 'none', padding: '1rem', margin: 0, display: 'none', flexDirection: 'column', gap: '1rem', border: '1px solid #333', minWidth: '200px', zIndex: 1000 }}>
                                    <li><a href="/products?category=Emotos" style={{ color: '#fff', textDecoration: 'none' }}>EMOTOS</a></li>
                                    <li><a href="/products?category=E%20Bikes" style={{ color: '#fff', textDecoration: 'none' }}>E BIKES</a></li>
                                    <li><a href="/products?category=E%20Scooters" style={{ color: '#fff', textDecoration: 'none' }}>E SCOOTERS</a></li>
                                    <li><a href="/products?category=Pedal%20Bikes" style={{ color: '#fff', textDecoration: 'none' }}>PEDAL BIKES</a></li>
                                </ul>
                            </li>

                            <li><a href="/decal-builder" style={{ color: '#fff', textDecoration: 'none' }}>DECAL LAB</a></li>
                            <li><a href="/products?category=Prebuilts" style={{ color: '#fff', textDecoration: 'none' }}>PREBUILTS</a></li>
                        </ul>
                        <div className="nav-title" style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'var(--font-heading)', textAlign: 'center', margin: '0 2rem' }}>
                            <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>MINIMOTO & CO</a>
                        </div>
                        <div className="nav-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'flex-end', fontSize: '0.9rem', fontWeight: '800' }}>
                            <span className="usd-text" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>USD <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                            <a href="/search" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </a>
                            <a href="#" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </a>
                            <CartIcon />
                        </div>
                    </nav>
                </header>
            )}
            <main style={{ marginTop: isCheckout ? '0' : '0' }}>
                {children}
            </main>
            {!isCheckout && (
                <footer style={{ marginTop: '4rem', padding: '4rem 0', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="container">
                        <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>MINI MOTO & CO</h2>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '2rem' }}>Highest quality mini surrons around!</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                            <a href="#">Instagram</a>
                            <a href="#">TikTok</a>
                            <a href="#">YouTube</a>
                        </div>
                        <p style={{ fontSize: '0.7rem', opacity: 0.4 }}>© 2026 MINI MOTO & CO. ALL RIGHTS RESERVED.</p>
                    </div>
                </footer>
            )}
        </>
    );
}

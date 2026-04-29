"use client";

import { usePathname } from "next/navigation";
import CartIcon from "@/components/CartIcon";

export default function ClientNav({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isCheckout = pathname === '/checkout';

    return (
        <>
            {!isCheckout && (
                <header style={{ position: 'relative', width: '100%', zIndex: 1000, padding: '1.5rem 0', backgroundColor: '#000', color: '#fff', borderBottom: '1px solid #333' }}>
                    <nav className="container" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                        <ul style={{ display: 'flex', gap: '2rem', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', margin: 0, padding: 0, listStyle: 'none' }}>
                            <li><a href="/" style={{ color: '#fff', textDecoration: 'none' }}>HOME</a></li>
                            <li><a href="/products" style={{ color: '#fff', textDecoration: 'none' }}>ALL BIKES</a></li>
                            <li><a href="/products?category=Upgrades" style={{ color: '#fff', textDecoration: 'none' }}>UPGRADES</a></li>
                            <li><a href="/collections" style={{ color: '#fff', textDecoration: 'none' }}>CATALOG</a></li>
                            <li><a href="#" style={{ color: '#fff', textDecoration: 'none' }}>CONTACT</a></li>
                        </ul>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'var(--font-heading)', textAlign: 'center', margin: '0 2rem' }}>
                            <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>ProjectMini</a>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'flex-end', fontSize: '0.9rem', fontWeight: '800' }}>
                            <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>USD <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
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

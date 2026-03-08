"use client";

import { usePathname } from "next/navigation";
import CartIcon from "@/components/CartIcon";

export default function ClientNav({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isCheckout = pathname === '/checkout';

    return (
        <>
            {!isCheckout && (
                <header className="glass" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, padding: '1rem 0' }}>
                    <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent-color)', fontFamily: 'var(--font-heading)' }}>
                            MINI MOTO & CO
                        </div>
                        <ul style={{ display: 'flex', gap: '2rem', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                            <li><a href="/">Home</a></li>
                            <li><a href="/products">Products</a></li>
                            <li><a href="/collections">Collections</a></li>
                            <li><a href="/admin" style={{ color: 'var(--accent-secondary)' }}>Admin</a></li>
                        </ul>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <a href="/search" style={{ fontSize: '1.2rem' }}>🔍</a>
                            <CartIcon />
                        </div>
                    </nav>
                </header>
            )}
            <main style={{ marginTop: isCheckout ? '0' : '80px' }}>
                {children}
            </main>
            {!isCheckout && (
                <footer className="glass" style={{ marginTop: '4rem', padding: '4rem 0', textAlign: 'center' }}>
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

'use client';

import { useCart } from "@/context/CartContext";

export default function CartIcon() {
    const { totalItems } = useCart();

    return (
        <a href="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🛒 <span style={{
                background: 'var(--accent-color)',
                color: '#000',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: '900'
            }}>
                {totalItems}
            </span>
        </a>
    );
}

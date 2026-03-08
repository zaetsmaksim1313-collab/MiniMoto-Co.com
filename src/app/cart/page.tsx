'use client';

import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { cart, removeFromCart, totalPrice, totalItems } = useCart();

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '2rem' }}>YOUR CART IS <span style={{ color: 'var(--accent-color)' }}>EMPTY</span></h1>
                <a href="/products" className="btn btn-primary">Start Shopping</a>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 className="section-title">Your <span style={{ color: 'var(--accent-color)' }}>Cart</span> ({totalItems} items)</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem' }}>
                <div>
                    {cart.map((item, idx) => (
                        <div key={idx} className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <div style={{ width: '120px', height: '120px', background: `url(${item.image}) no-repeat center/cover`, borderRadius: '8px' }}></div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>
                                    {Object.entries(item.selectedOptions).map(([k, v]) => (
                                        <span key={k} style={{ marginRight: '1rem' }}>{k}: {v}</span>
                                    ))}
                                </div>
                                <p style={{ fontWeight: '700' }}>{item.quantity} x ${item.price}</p>
                            </div>
                            <button onClick={() => removeFromCart(item.id, item.selectedOptions)} style={{ background: 'transparent', color: '#ff4b2b', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
                        </div>
                    ))}
                </div>

                <div className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Order Summary</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span>Subtotal</span>
                        <span>${totalPrice}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', opacity: 0.6 }}>
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '1.2rem' }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--accent-color)' }}>${totalPrice}</span>
                    </div>
                    <a href="/checkout" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Checkout Now</a>
                </div>
            </div>
        </div>
    );
}

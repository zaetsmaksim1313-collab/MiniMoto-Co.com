'use client';

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Link from "next/link";
import { placeOrder } from "@/app/admin/order-actions";

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const [step, setStep] = useState(1); // 1: Info, 2: Shipping, 3: Payment
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zipCode: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) setStep(step + 1);
        else {
            const res = await placeOrder({
                customer: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    address: formData.address,
                    city: formData.city,
                    zipCode: formData.zipCode,
                },
                items: cart.map(item => ({
                    productId: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    selectedOptions: item.selectedOptions
                })),
                total: totalPrice
            });

            if (res.success) {
                setOrderId(res.orderId || '');
                setSuccess(true);
                clearCart();
            }
        }
    };

    if (success) {
        return (
            <div className="checkout-success">
                <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                    <h1>Thank you for your purchase!</h1>
                    <p>Your order {orderId} is being processed. We'll send you an email confirmation shortly.</p>
                    <Link href="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '2rem', padding: '12px 32px', background: 'black', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Continue shopping</Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
                <h2>Your cart is empty</h2>
                <Link href="/products" style={{ textDecoration: 'underline' }}>Browse products</Link>
            </div>
        );
    }

    return (
        <div className="checkout-wrapper">
            <div className="container">
                <div className="checkout-grid">
                    <div className="main-content">
                        <header className="checkout-header">
                            <h1 style={{ color: 'black', letterSpacing: '0' }}>MINI MOTO & CO</h1>
                            <nav className="steps">
                                <span className={step >= 1 ? 'active' : ''}>Information</span>
                                <span className={step >= 2 ? 'active' : ''}>Shipping</span>
                                <span className={step >= 3 ? 'active' : ''}>Payment</span>
                            </nav>
                        </header>

                        <form onSubmit={handleNext}>
                            {step === 1 && (
                                <section>
                                    <h3>Contact information</h3>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required />
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                                        <input type="checkbox" id="news" />
                                        <label htmlFor="news" style={{ fontSize: '0.8rem' }}>Email me with news and offers</label>
                                    </div>

                                    <h3 style={{ marginTop: '2rem' }}>Shipping address</h3>
                                    <div className="form-grid">
                                        <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" required />
                                        <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" required />
                                        <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" style={{ gridColumn: 'span 2' }} required />
                                        <input placeholder="Apartment, suite, etc. (optional)" style={{ gridColumn: 'span 2' }} />
                                        <input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" required />
                                        <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="ZIP code" required />
                                    </div>

                                    <div className="step-footer">
                                        <Link href="/cart" style={{ fontSize: '0.9rem', color: '#1a73e8' }}>Return to cart</Link>
                                        <button type="submit" className="btn-step">Continue to shipping</button>
                                    </div>
                                </section>
                            )}

                            {step === 2 && (
                                <section>
                                    <div className="summary-box">
                                        <div className="summary-row">
                                            <span className="label">Contact</span>
                                            <span className="value">user@example.com</span>
                                            <button type="button" onClick={() => setStep(1)}>Change</button>
                                        </div>
                                        <div className="summary-row">
                                            <span className="label">Ship to</span>
                                            <span className="value">123 Street, NY, 10001</span>
                                            <button type="button" onClick={() => setStep(1)}>Change</button>
                                        </div>
                                    </div>

                                    <h3 style={{ marginTop: '2rem' }}>Shipping method</h3>
                                    <div className="method-box">
                                        <div className="method-row">
                                            <input type="radio" defaultChecked />
                                            <span>Standard Shipping</span>
                                            <span className="price">Free</span>
                                        </div>
                                    </div>

                                    <div className="step-footer">
                                        <button type="button" onClick={() => setStep(1)} style={{ fontSize: '0.9rem', color: '#1a73e8', border: 'none', background: 'none' }}>Return to information</button>
                                        <button type="submit" className="btn-step">Continue to payment</button>
                                    </div>
                                </section>
                            )}

                            {step === 3 && (
                                <section>
                                    <div className="summary-box">
                                        <div className="summary-row">
                                            <span className="label">Contact</span>
                                            <span className="value">user@example.com</span>
                                        </div>
                                        <div className="summary-row">
                                            <span className="label">Ship to</span>
                                            <span className="value">123 Street, NY, 10001</span>
                                        </div>
                                        <div className="summary-row">
                                            <span className="label">Method</span>
                                            <span className="value">Standard · Free</span>
                                        </div>
                                    </div>

                                    <h3 style={{ marginTop: '2rem' }}>Payment</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>All transactions are secure and encrypted.</p>
                                    <div className="payment-box">
                                        <div className="payment-header">
                                            <span>Credit card</span>
                                            <div className="cards">💳 💳 💳</div>
                                        </div>
                                        <div className="payment-body">
                                            <input placeholder="Card number" style={{ width: '100%' }} />
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                <input placeholder="Expiration date (MM / YY)" style={{ flex: 1 }} />
                                                <input placeholder="Security code" style={{ flex: 1 }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="step-footer">
                                        <button type="button" onClick={() => setStep(2)} style={{ fontSize: '0.9rem', color: '#1a73e8', border: 'none', background: 'none' }}>Return to shipping</button>
                                        <button type="submit" className="btn-step" style={{ background: '#197bbd' }}>Pay now</button>
                                    </div>
                                </section>
                            )}
                        </form>
                    </div>

                    <aside className="order-summary">
                        <div className="items-list">
                            {cart.map((item, idx) => (
                                <div key={idx} className="summary-item">
                                    <div className="item-img">
                                        <span className="q-badge">{item.quantity}</span>
                                    </div>
                                    <div className="item-info">
                                        <div className="item-name">{item.name}</div>
                                        <div className="item-options">{Object.values(item.selectedOptions || {}).join(' / ')}</div>
                                    </div>
                                    <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-costs">
                            <div className="cost-row">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="cost-row">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="total-row">
                                <span>Total</span>
                                <span className="final-price">USD ${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <style jsx>{`
                .checkout-wrapper { background: #fff; color: #333; min-height: 100vh; padding-top: 4rem; }
                .checkout-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 0; }
                .main-content { padding-right: 4rem; border-right: 1px solid #e1e1e1; min-height: 100vh; }
                .order-summary { padding-left: 4rem; background: #fafafa; min-height: 100vh; }

                .checkout-header { margin-bottom: 2rem; }
                .steps { display: flex; gap: 1rem; font-size: 0.8rem; margin-top: 1rem; color: #666; }
                .steps span { display: flex; align-items: center; gap: 8px; }
                .steps span.active { color: black; font-weight: 600; }
                .steps span:not(:last-child):after { content: '>'; color: #ccc; }

                h3 { font-size: 1.1rem; margin-bottom: 1rem; margin-top: 0; }
                input { width: 100%; padding: 12px; border: 1px solid #d9d9d9; border-radius: 4px; margin-bottom: 8px; font-size: 0.9rem; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

                .step-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; }
                .btn-step { background: #1a1a1a; color: white; padding: 18px 24px; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; }

                .summary-box { border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px; }
                .summary-row { display: flex; align-items: center; font-size: 0.85rem; padding: 8px 0; }
                .summary-row:not(:last-child) { border-bottom: 1px solid #e1e1e1; }
                .summary-row .label { width: 80px; color: #666; }
                .summary-row .value { flex: 1; }
                .summary-row button { color: #1a73e8; border: none; background: none; font-size: 0.8rem; cursor: pointer; }

                .method-box, .payment-box { border: 1px solid #d9d9d9; border-radius: 4px; }
                .method-row { display: flex; align-items: center; gap: 12px; padding: 16px; font-size: 0.9rem; }
                .payment-header { display: flex; justify-content: space-between; padding: 12px 16px; background: #fafafa; border-bottom: 1px solid #d9d9d9; }
                .payment-body { padding: 16px; background: #fff; }

                .summary-item { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
                .item-img { width: 64px; height: 64px; background: #eee; border: 1px solid #e1e1e1; border-radius: 8px; position: relative; }
                .q-badge { position: absolute; top: -8px; right: -8px; background: #666; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; }
                .item-info { flex: 1; }
                .item-name { font-weight: 600; font-size: 0.9rem; }
                .item-options { font-size: 0.8rem; color: #666; }
                .item-price { font-weight: 600; font-size: 0.9rem; }

                .summary-costs { border-top: 1px solid #e1e1e1; padding-top: 1.5rem; margin-top: 1.5rem; }
                .cost-row { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.5rem; }
                .total-row { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; font-weight: 600; font-size: 1.1rem; }
                .final-price { font-size: 1.5rem; }

                @media (max-width: 900px) {
                    .checkout-grid { grid-template-columns: 1fr; }
                    .main-content { border-right: none; padding-right: 0; order: 2; }
                    .order-summary { padding-left: 0; min-height: auto; order: 1; margin-bottom: 2rem; }
                }
            `}</style>
        </div>
    );
}

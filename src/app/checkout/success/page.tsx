'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useCart } from '@/context/CartContext';

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id') || '';
    const { clearCart } = useCart();
    const [orderNumber, setOrderNumber] = useState('...');

    useEffect(() => {
        // Clear the user's cart now that checkout is successful
        clearCart();
        
        if (sessionId && sessionId.startsWith('cs_')) {
            // Use part of the Stripe session ID to act as a clean order number
            setOrderNumber(sessionId.substring(sessionId.length - 8).toUpperCase());
        } else {
            // Fallback random order number if accessed directly
            setOrderNumber(Math.floor(100000 + Math.random() * 900000).toString());
        }
    }, [sessionId, clearCart]);

    return (
        <div className="success-container">
            <div className="success-card">
                <div className="checkmark-wrapper">
                    <div className="checkmark">✓</div>
                </div>
                
                <h1 className="title">Order Confirmed!</h1>
                <p className="subtitle">Thank you for your purchase.</p>
                
                <div className="order-details">
                    <div className="detail-row">
                        <span>Order Number:</span>
                        <strong>#{orderNumber}</strong>
                    </div>
                    <div className="detail-row">
                        <span>Estimated Arrival:</span>
                        <strong>1.5 Weeks</strong>
                    </div>
                </div>

                <p className="email-notice">
                    We've received your order! A receipt and tracking updates will be sent to your email shortly.
                </p>

                <Link href="/" className="btn-home">
                    Continue Shopping
                </Link>
            </div>

            <style jsx>{`
                .success-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8f8f8;
                    padding: 2rem;
                }

                .success-card {
                    background: white;
                    padding: 3rem 2rem;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    max-width: 450px;
                    width: 100%;
                    text-align: center;
                }

                .checkmark-wrapper {
                    width: 64px;
                    height: 64px;
                    background: #000;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem auto;
                }

                .checkmark {
                    color: white;
                    font-size: 32px;
                    font-weight: bold;
                }

                .title {
                    font-size: 2rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    letter-spacing: -0.02em;
                    color: #000;
                }

                .subtitle {
                    color: #666;
                    margin-bottom: 2rem;
                }

                .order-details {
                    background: #f4f4f5;
                    border-radius: 8px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    font-size: 0.95rem;
                }
                
                .detail-row:last-child {
                    margin-bottom: 0;
                }

                .detail-row span {
                    color: #666;
                }

                .detail-row strong {
                    color: #000;
                    font-weight: 700;
                }

                .email-notice {
                    font-size: 0.85rem;
                    color: #888;
                    line-height: 1.5;
                    margin-bottom: 2rem;
                }

                .btn-home {
                    display: block;
                    width: 100%;
                    background: #000;
                    color: #fff;
                    padding: 1rem;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: 700;
                    transition: background 0.2s;
                }

                .btn-home:hover {
                    background: #333;
                }
            `}</style>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div style={{padding: '4rem', textAlign: 'center'}}>Processing your order...</div>}>
            <SuccessContent />
        </Suspense>
    );
}

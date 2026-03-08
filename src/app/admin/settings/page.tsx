'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
    const [domain, setDomain] = useState('mini-moto-co.com');
    const [shopName, setShopName] = useState('Mini Moto & Co');

    return (
        <div>
            <h1 className="admin-title">Settings</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 300px) 1fr', gap: '4rem' }}>
                <aside>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Store details</h3>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>Shopify and your customers use this information to contact you.</p>
                </aside>
                <div className="admin-card">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Store name</label>
                        <input
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                        />
                    </div>
                </div>
            </div>

            <hr style={{ margin: '3rem 0', border: 'none', borderTop: '1px solid #e1e1e1' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 300px) 1fr', gap: '4rem' }}>
                <aside>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Domains</h3>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>Connect a custom domain so people can find your store.</p>
                </aside>
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <div style={{ fontWeight: '600' }}>{domain}</div>
                            <div style={{ fontSize: '0.8rem', color: '#007f5f' }}>Primary domain</div>
                        </div>
                        <button className="btn-admin">Change primary domain</button>
                    </div>

                    <div style={{ padding: '1rem', background: '#f6f6f7', borderRadius: '8px', border: '1px solid #e1e1e1' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Connect existing domain</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                placeholder="example.com"
                                style={{ flex: 1, padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                            />
                            <button className="btn-admin btn-admin-primary">Next</button>
                        </div>
                    </div>
                </div>
            </div>

            <hr style={{ margin: '3rem 0', border: 'none', borderTop: '1px solid #e1e1e1' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 300px) 1fr', gap: '4rem' }}>
                <aside>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Payouts</h3>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>Manage how you receive money from your sales.</p>
                </aside>
                <div className="admin-card">
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Your payouts are currently being sent to:</p>
                    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '4px', border: '1px solid #e1e1e1', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '24px', background: '#1a1a1a', borderRadius: '2px' }}></div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>MAKSIMS BANK</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>Ending in 4321</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem' }}>
                <button className="btn-admin btn-admin-primary" style={{ padding: '12px 24px' }}>Save settings</button>
            </div>
        </div>
    );
}

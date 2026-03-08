'use client';

const transactions = [
    { date: 'Feb 25, 2026', status: 'Posted', description: 'SHOPIFY* 494222938', account: 'Main', amount: -61.26 },
    { date: 'Feb 25, 2026', status: 'Posted', description: 'Shopify Payments payout', account: 'Main', amount: 8.34 },
    { date: 'Feb 26, 2026', status: 'Posted', description: 'Shopify Payments', account: 'Payouts', amount: -8.34 },
    { date: 'Feb 22, 2026', status: 'Posted', description: 'Shopify Payments payout', account: 'Main', amount: 67.60 },
];

export default function AdminFinancePage() {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 className="admin-title" style={{ margin: 0 }}> Finance</h1>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-admin">Transfer funds</button>
                    <button className="btn-admin">Pay bills</button>
                    <button className="btn-admin btn-admin-primary">Add cash</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="admin-card">
                    <h3 style={{ fontSize: '0.9rem', margin: '0 0 16px 0', color: '#6d6d6d' }}>Available balance</h3>
                    <div style={{ fontSize: '2rem', fontWeight: '700' }}>$1,264.40</div>
                    <div style={{ marginTop: '16px', color: '#005bd3', fontSize: '0.9rem', cursor: 'pointer' }}>View payouts</div>
                </div>
                <div className="admin-card">
                    <h3 style={{ fontSize: '0.9rem', margin: '0 0 16px 0', color: '#6d6d6d' }}>Payout balance</h3>
                    <div style={{ fontSize: '2rem', fontWeight: '700' }}>$53.03</div>
                    <div style={{ marginTop: '16px', color: '#005bd3', fontSize: '0.9rem', cursor: 'pointer' }}>View payouts</div>
                </div>
            </div>

            <div className="admin-card" style={{ padding: 0 }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #ebebeb' }}>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>Recent transactions</h3>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Description</th>
                            <th>Account</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t, idx) => (
                            <tr key={idx}>
                                <td style={{ fontSize: '0.9rem' }}>{t.date}</td>
                                <td>
                                    <span style={{ fontSize: '0.8rem', background: '#f1f1f1', padding: '2px 8px', borderRadius: '4px' }}>{t.status}</span>
                                </td>
                                <td style={{ fontSize: '0.9rem', fontWeight: '500' }}>{t.description}</td>
                                <td style={{ fontSize: '0.9rem', color: '#6d6d6d' }}>{t.account}</td>
                                <td style={{ textAlign: 'right', fontWeight: '600', color: t.amount < 0 ? '#1a1a1a' : '#007f5f' }}>
                                    {t.amount < 0 ? `-$${Math.abs(t.amount)}` : `+$${t.amount}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

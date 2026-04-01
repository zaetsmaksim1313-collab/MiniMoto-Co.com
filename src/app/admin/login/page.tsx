'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            body: JSON.stringify({ password }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (res.ok) {
            router.push('/admin');
            router.refresh();
        } else {
            setError('Invalid password');
            setIsLoading(false);
        }
    }

    return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '1rem', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Admin Login</h1>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Enter the master password to access the dashboard.</p>
                <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                    style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '6px' }} 
                />
                {error && <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
                <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%' }}>
                    {isLoading ? 'Authenticating...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

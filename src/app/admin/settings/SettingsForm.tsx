'use client';

import { useState } from 'react';
import { updateMakeItYoursImages } from '../actions';

export default function SettingsForm({ initialImages }: { initialImages: string[] }) {
    const [images, setImages] = useState(initialImages.join(',\n'));
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const handleSave = async () => {
        setStatus('saving');
        const urls = images.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        const result = await updateMakeItYoursImages(urls);
        if (result.success) {
            setStatus('success');
            setTimeout(() => setStatus('idle'), 2000);
        } else {
            console.error(result.error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <textarea 
                value={images}
                onChange={(e) => setImages(e.target.value)}
                style={{
                    width: '100%',
                    minHeight: '150px',
                    padding: '0.75rem',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    resize: 'vertical'
                }}
                placeholder="https://image1.jpg,&#10;https://image2.jpg,&#10;https://image3.jpg"
            />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                    onClick={handleSave}
                    disabled={status === 'saving'}
                    style={{
                        background: '#1a1a1a',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '6px',
                        fontWeight: 600,
                        cursor: status === 'saving' ? 'wait' : 'pointer'
                    }}
                >
                    {status === 'saving' ? 'Saving...' : 'Save Images'}
                </button>
                
                {status === 'success' && <span style={{ color: 'green', fontSize: '0.85rem', fontWeight: 500 }}>Saved successfully!</span>}
                {status === 'error' && <span style={{ color: 'red', fontSize: '0.85rem', fontWeight: 500 }}>Error saving. Check console.</span>}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {images.split(',').map((url, i) => {
                    const trimmed = url.trim();
                    if (!trimmed) return null;
                    return (
                        <div key={i} style={{ width: '80px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #eee' }}>
                            <img src={trimmed} alt={`Preview ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

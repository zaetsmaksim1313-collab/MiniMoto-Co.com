'use client';

import { useState, useRef } from 'react';
import { updateMakeItYoursImages } from '../actions';

export default function SettingsForm({ initialImages }: { initialImages: string[] }) {
    const [images, setImages] = useState<string[]>(initialImages);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [newUrl, setNewUrl] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async () => {
        setStatus('saving');
        const result = await updateMakeItYoursImages(images);
        if (result.success) {
            setStatus('success');
            setTimeout(() => setStatus('idle'), 2500);
        } else {
            console.error(result.error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    const handleAddUrl = () => {
        const trimmed = newUrl.trim();
        if (trimmed) {
            setImages(prev => [...prev, trimmed]);
            setNewUrl('');
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleMoveLeft = (index: number) => {
        if (index === 0) return;
        setImages(prev => {
            const next = [...prev];
            const temp = next[index - 1];
            next[index - 1] = next[index];
            next[index] = temp;
            return next;
        });
    };

    const handleMoveRight = (index: number) => {
        if (index === images.length - 1) return;
        setImages(prev => {
            const next = [...prev];
            const temp = next[index + 1];
            next[index + 1] = next[index];
            next[index] = temp;
            return next;
        });
    };

    const processImageFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_DIMENSION = 1400;

                if (width > height && width > MAX_DIMENSION) {
                    height *= MAX_DIMENSION / width;
                    width = MAX_DIMENSION;
                } else if (height > MAX_DIMENSION) {
                    width *= MAX_DIMENSION / height;
                    height = MAX_DIMENSION;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
                setImages(prev => [...prev, compressedDataUrl]);
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(processImageFile);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (!files) return;
        Array.from(files).forEach(processImageFile);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    border: `2px dashed ${isDragging ? '#000' : '#d1d1d6'}`,
                    background: isDragging ? '#f4f4f5' : '#fafafa',
                    borderRadius: '12px',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#18181b', marginBottom: '0.3rem' }}>
                    Click to upload photos or drag &amp; drop here
                </div>
                <div style={{ fontSize: '0.82rem', color: '#71717a' }}>
                    Supports JPG, PNG, WEBP. Photos will appear in the 1/1 Decal Lab section on the homepage.
                </div>
            </div>

            {/* Direct URL input */}
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="Or paste image URL (e.g. /custom 1.JPG or https://...)"
                    style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        border: '1px solid #e4e4e7',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddUrl();
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={handleAddUrl}
                    style={{
                        padding: '0.75rem 1.4rem',
                        background: '#27272a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                    }}
                >
                    + Add URL
                </button>
            </div>

            {/* Current Photos Gallery with Controls */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
                        Active Showcase Photos ({images.length})
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#71717a' }}>
                        Use ← / → arrows to reorder, or ✕ to remove
                    </span>
                </div>

                {images.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', background: '#f4f4f5', borderRadius: '8px', color: '#71717a', fontSize: '0.9rem' }}>
                        No photos added yet. Upload or paste an image URL above.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                        {images.map((url, idx) => (
                            <div
                                key={idx}
                                style={{
                                    position: 'relative',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    border: '1px solid #e4e4e7',
                                    background: '#18181b',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <div style={{ position: 'relative', aspectRatio: '4/3', width: '100%', overflow: 'hidden' }}>
                                    <img
                                        src={url}
                                        alt={`Showcase ${idx + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '6px',
                                        left: '6px',
                                        background: 'rgba(0,0,0,0.75)',
                                        color: '#fff',
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                    }}>
                                        #{idx + 1}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        title="Remove photo"
                                        style={{
                                            position: 'absolute',
                                            top: '6px',
                                            right: '6px',
                                            background: '#ef4444',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontWeight: 800,
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '6px 8px',
                                    background: '#ffffff',
                                    borderTop: '1px solid #f4f4f5',
                                }}>
                                    <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => handleMoveLeft(idx)}
                                        style={{
                                            background: idx === 0 ? '#f4f4f5' : '#e4e4e7',
                                            color: idx === 0 ? '#a1a1aa' : '#18181b',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '4px 10px',
                                            fontSize: '0.8rem',
                                            fontWeight: 800,
                                            cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        ←
                                    </button>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#71717a', alignSelf: 'center' }}>
                                        Position {idx + 1}
                                    </span>
                                    <button
                                        type="button"
                                        disabled={idx === images.length - 1}
                                        onClick={() => handleMoveRight(idx)}
                                        style={{
                                            background: idx === images.length - 1 ? '#f4f4f5' : '#e4e4e7',
                                            color: idx === images.length - 1 ? '#a1a1aa' : '#18181b',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '4px 10px',
                                            fontSize: '0.8rem',
                                            fontWeight: 800,
                                            cursor: idx === images.length - 1 ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Save Action Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.2rem',
                paddingTop: '1rem',
                borderTop: '1px solid #f4f4f5',
            }}>
                <button
                    onClick={handleSave}
                    disabled={status === 'saving'}
                    style={{
                        background: '#000000',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.9rem 2.5rem',
                        borderRadius: '8px',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        cursor: status === 'saving' ? 'wait' : 'pointer',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {status === 'saving' ? 'Saving Photos...' : 'Save & Publish Photos'}
                </button>

                {status === 'success' && (
                    <span style={{ color: '#16a34a', fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        ✓ Saved successfully! Homepage updated.
                    </span>
                )}
                {status === 'error' && (
                    <span style={{ color: '#dc2626', fontSize: '0.95rem', fontWeight: 700 }}>
                        ✕ Error saving photos. Please try again.
                    </span>
                )}
            </div>
        </div>
    );
}

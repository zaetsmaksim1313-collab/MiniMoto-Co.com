'use client';

import { useState, useRef } from 'react';
import { updateMakeItYoursImages } from '../actions';

interface BuildPair {
    designer: string;
    printed: string;
}

export default function SettingsForm({ initialImages }: { initialImages: string[] }) {
    // Convert flat initialImages to 4 pairs
    const getInitialPairs = (): BuildPair[] => {
        const pairs: BuildPair[] = [
            { designer: '', printed: '' },
            { designer: '', printed: '' },
            { designer: '', printed: '' },
            { designer: '', printed: '' },
        ];

        if (initialImages && initialImages.length >= 8) {
            pairs[0] = { designer: initialImages[0] || '', printed: initialImages[2] || initialImages[1] || '' };
            pairs[1] = { designer: initialImages[1] || '', printed: initialImages[3] || initialImages[4] || '' };
            pairs[2] = { designer: initialImages[5] || initialImages[4] || '', printed: initialImages[4] || initialImages[5] || '' };
            pairs[3] = { designer: initialImages[6] || '', printed: initialImages[7] || '' };
        } else if (initialImages) {
            for (let i = 0; i < 4; i++) {
                pairs[i] = {
                    designer: initialImages[i] || '',
                    printed: initialImages[i + 4] || '',
                };
            }
        }
        return pairs;
    };

    const [pairs, setPairs] = useState<BuildPair[]>(getInitialPairs());
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [activeUploadSlot, setActiveUploadSlot] = useState<{ buildIdx: number; type: 'designer' | 'printed' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async () => {
        setStatus('saving');
        setErrorMessage('');

        const flatList: string[] = [
            pairs[0].designer,
            pairs[1].designer,
            pairs[0].printed,
            pairs[1].printed,
            pairs[2].printed,
            pairs[2].designer,
            pairs[3].designer,
            pairs[3].printed,
        ];

        try {
            // First try high-speed API route
            const res = await fetch('/api/admin/save-showcase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: flatList }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setStatus('success');
                    setTimeout(() => setStatus('idle'), 3000);
                    return;
                }
            }

            // Fallback to server action
            const actionRes = await updateMakeItYoursImages(flatList);
            if (actionRes.success) {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                throw new Error(actionRes.error || 'Server error saving images');
            }
        } catch (e: any) {
            console.error("Save error:", e);
            setStatus('error');
            setErrorMessage(e.message || 'Failed to save. Please try again.');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    // Client-side smart compression for instant uploads
    const processImageFile = (file: File, buildIdx: number, type: 'designer' | 'printed') => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_DIMENSION = 1000; // Optimal web resolution (~70KB per photo)

                if (width > height && width > MAX_DIMENSION) {
                    height *= MAX_DIMENSION / width;
                    width = MAX_DIMENSION;
                } else if (height > MAX_DIMENSION) {
                    width *= MAX_DIMENSION / height;
                    height = MAX_DIMENSION;
                }

                canvas.width = Math.round(width);
                canvas.height = Math.round(height);
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }

                // Crisp, lightweight JPEG compression
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.84);
                setPairs(prev => {
                    const next = [...prev];
                    next[buildIdx] = {
                        ...next[buildIdx],
                        [type]: compressedDataUrl,
                    };
                    return next;
                });
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    };

    const triggerUpload = (buildIdx: number, type: 'designer' | 'printed') => {
        setActiveUploadSlot({ buildIdx, type });
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeUploadSlot) {
            processImageFile(file, activeUploadSlot.buildIdx, activeUploadSlot.type);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleUrlChange = (buildIdx: number, type: 'designer' | 'printed', value: string) => {
        setPairs(prev => {
            const next = [...prev];
            next[buildIdx] = {
                ...next[buildIdx],
                [type]: value,
            };
            return next;
        });
    };

    const handleClearPhoto = (buildIdx: number, type: 'designer' | 'printed') => {
        setPairs(prev => {
            const next = [...prev];
            next[buildIdx] = {
                ...next[buildIdx],
                [type]: '',
            };
            return next;
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            <div style={{
                background: '#f4f4f5',
                padding: '1.2rem 1.5rem',
                borderRadius: '10px',
                fontSize: '0.88rem',
                color: '#3f3f46',
                lineHeight: 1.5,
            }}>
                <strong>💡 4 Before &amp; After Comparison Builds:</strong> Each build pairs an <em>"In The Designer"</em> digital decal image with the corresponding <em>"Printed Out"</em> physical bike photo. Customers can drag an interactive slider to compare both!
            </div>

            {/* 4 Build Pairs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {pairs.map((pair, buildIdx) => (
                    <div
                        key={buildIdx}
                        style={{
                            background: '#ffffff',
                            border: '1.5px solid #e4e4e7',
                            borderRadius: '14px',
                            padding: '1.25rem',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #f4f4f5',
                            paddingBottom: '0.6rem',
                        }}>
                            <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#000' }}>
                                BUILD #{buildIdx + 1}
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#71717a' }}>
                                Slider Card
                            </span>
                        </div>

                        {/* Slot 1: In the Designer */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#18181b' }}>
                                    🎨 In The Designer (Decal)
                                </span>
                                {pair.designer && (
                                    <button
                                        type="button"
                                        onClick={() => handleClearPhoto(buildIdx, 'designer')}
                                        style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {pair.designer ? (
                                <div style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e4e4e7', background: '#fafafa' }}>
                                    <img
                                        src={pair.designer}
                                        alt={`Build #${buildIdx + 1} Designer`}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4%' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => triggerUpload(buildIdx, 'designer')}
                                        style={{
                                            position: 'absolute',
                                            bottom: '6px',
                                            right: '6px',
                                            background: 'rgba(0,0,0,0.8)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '4px 10px',
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Replace
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => triggerUpload(buildIdx, 'designer')}
                                    style={{
                                        aspectRatio: '1/1',
                                        border: '2px dashed #d1d1d6',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        background: '#fafafa',
                                        color: '#71717a',
                                        fontSize: '0.8rem',
                                        gap: '0.3rem',
                                    }}
                                >
                                    <span style={{ fontSize: '1.4rem' }}>📁</span>
                                    <span>Upload Decal Photo</span>
                                </div>
                            )}
                            <input
                                type="text"
                                value={pair.designer.startsWith('data:') ? '[Uploaded Image File]' : pair.designer}
                                onChange={(e) => handleUrlChange(buildIdx, 'designer', e.target.value)}
                                placeholder="Or image URL..."
                                style={{
                                    width: '100%',
                                    marginTop: '0.4rem',
                                    padding: '0.4rem 0.6rem',
                                    fontSize: '0.75rem',
                                    border: '1px solid #e4e4e7',
                                    borderRadius: '6px',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        {/* Slot 2: Printed Out */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#18181b' }}>
                                    🏍️ Printed Out (On Bike)
                                </span>
                                {pair.printed && (
                                    <button
                                        type="button"
                                        onClick={() => handleClearPhoto(buildIdx, 'printed')}
                                        style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {pair.printed ? (
                                <div style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e4e4e7', background: '#fafafa' }}>
                                    <img
                                        src={pair.printed}
                                        alt={`Build #${buildIdx + 1} Printed`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => triggerUpload(buildIdx, 'printed')}
                                        style={{
                                            position: 'absolute',
                                            bottom: '6px',
                                            right: '6px',
                                            background: 'rgba(0,0,0,0.8)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '4px 10px',
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Replace
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => triggerUpload(buildIdx, 'printed')}
                                    style={{
                                        aspectRatio: '1/1',
                                        border: '2px dashed #d1d1d6',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        background: '#fafafa',
                                        color: '#71717a',
                                        fontSize: '0.8rem',
                                        gap: '0.3rem',
                                    }}
                                >
                                    <span style={{ fontSize: '1.4rem' }}>📷</span>
                                    <span>Upload Bike Photo</span>
                                </div>
                            )}
                            <input
                                type="text"
                                value={pair.printed.startsWith('data:') ? '[Uploaded Image File]' : pair.printed}
                                onChange={(e) => handleUrlChange(buildIdx, 'printed', e.target.value)}
                                placeholder="Or image URL..."
                                style={{
                                    width: '100%',
                                    marginTop: '0.4rem',
                                    padding: '0.4rem 0.6rem',
                                    fontSize: '0.75rem',
                                    border: '1px solid #e4e4e7',
                                    borderRadius: '6px',
                                    outline: 'none',
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Save & Publish Bar */}
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
                        padding: '1rem 2.8rem',
                        borderRadius: '8px',
                        fontWeight: 900,
                        fontSize: '1rem',
                        cursor: status === 'saving' ? 'wait' : 'pointer',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {status === 'saving' ? 'Saving 4 Builds...' : 'Save & Publish 4 Builds'}
                </button>

                {status === 'success' && (
                    <span style={{ color: '#16a34a', fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        ✓ Saved successfully! All 4 Before/After sliders updated.
                    </span>
                )}
                {status === 'error' && (
                    <span style={{ color: '#dc2626', fontSize: '0.95rem', fontWeight: 700 }}>
                        ✕ {errorMessage || 'Error saving. Please try again.'}
                    </span>
                )}
            </div>
        </div>
    );
}

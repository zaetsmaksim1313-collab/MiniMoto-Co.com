'use client';

import { useState } from 'react';
import { updateProduct } from '../../actions';
import { useRouter } from 'next/navigation';
import { Product, ProductOption } from '@/lib/products';

export default function EditProductForm({ product }: { product: Product }) {
    const router = useRouter();
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());
    const [description, setDescription] = useState(product.description || '');
    const [category, setCategory] = useState(product.category || '');
    const [images, setImages] = useState<string[]>(product.images || []);
    const [options, setOptions] = useState<ProductOption[]>(product.options || []);
    const [isSaving, setIsSaving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const processImageFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_DIMENSION = 1200;

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

                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                setImages(prev => [...prev, compressedDataUrl]);
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(processImageFile);
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

    const addOption = () => {
        setOptions([...options, { name: '', type: 'dropdown', values: [] }]);
    };

    const updateOption = (index: number, key: string, value: any) => {
        const newOptions = [...options];
        (newOptions[index] as any)[key] = value;
        setOptions(newOptions);
    };

    const addOptionValue = (optIndex: number) => {
        const newOptions = [...options];
        newOptions[optIndex].values.push({ value: '', priceModifier: 0 });
        setOptions(newOptions);
    };

    const updateOptionValue = (optIndex: number, valIndex: number, key: string, val: any) => {
        const newOptions = [...options];
        (newOptions[optIndex].values[valIndex] as any)[key] = val;
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('id', product.id);
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('category', category);
            if (images.length > 0) {
                formData.append('images', JSON.stringify(images));
            }
            formData.append('options', JSON.stringify(options));
            formData.append('status', product.status || 'Active');
            
            const res = await updateProduct(formData);
            if (res && res.success === false) {
                alert("Error saving product: " + res.error);
                setIsSaving(false);
                return;
            }
            router.push('/admin/products');
            router.refresh();
        } catch (err: any) {
            console.error("Save Error:", err);
            alert("Failed to save: Payload might be too large. Try picking fewer photos or compressing them.");
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 className="admin-title" style={{ margin: 0 }}>Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ color: 'black', background: 'white', width: '100%', padding: '0.8rem', border: '1px solid #e1e1e1', borderRadius: '4px' }} placeholder="Short title e.g. Mini ETM RTR" />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Price</label>
                            <input type="number" step="any" value={price} onChange={e => setPrice(e.target.value)} required style={{ color: 'black', background: 'white', width: '100%', padding: '0.8rem', border: '1px solid #e1e1e1', borderRadius: '4px' }} placeholder="0.00" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Category</label>
                            <input type="text" value={category} onChange={e => setCategory(e.target.value)} style={{ color: 'black', background: 'white', width: '100%', padding: '0.8rem', border: '1px solid #e1e1e1', borderRadius: '4px' }} placeholder="Bikes" />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} style={{ color: 'black', background: 'white', width: '100%', padding: '0.8rem', border: '1px solid #e1e1e1', borderRadius: '4px' }} placeholder="Product details..." />
                    </div>
                </div>
                
                <div className="admin-card">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '1rem' }}>Media</label>
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{ border: `2px dashed ${isDragging ? '#000' : '#ccc'}`, padding: '2rem', textAlign: 'center', borderRadius: '8px', marginBottom: '1rem', background: isDragging ? '#f0f0f0' : '#fafafa', transition: 'all 0.2s ease', cursor: 'pointer' }}
                        onClick={() => document.getElementById('edit-file-upload')?.click()}
                    >
                        <input id="edit-file-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                        <p style={{ margin: 0, color: '#333', fontWeight: 'bold' }}>Drop images here</p>
                        <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>or click to select from your computer.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {images.map((img, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                                <img src={img} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid #eee', borderRadius: '4px' }} />
                                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: '10px' }}>X</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Options</label>
                        <button type="button" onClick={addOption} className="btn-admin" style={{ background: '#f1f1f1', border: 'none' }}>+ Add Option</button>
                    </div>
                    
                    {options.length === 0 && <p style={{ color: '#666', margin: 0 }}>This product does not have any options like size or color.</p>}
                    
                    {options.map((opt, optIndex) => (
                        <div key={optIndex} style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ flex: 2 }}>
                                    <label style={{ fontSize: '0.9rem', color: '#444' }}>Option Name</label>
                                    <input type="text" value={opt.name} onChange={e => updateOption(optIndex, 'name', e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e1e1e1', borderRadius: '4px', marginTop: '4px' }} placeholder="e.g. Color" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.9rem', color: '#444' }}>Display Type</label>
                                    <select value={opt.type} onChange={e => updateOption(optIndex, 'type', e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e1e1e1', borderRadius: '4px', marginTop: '4px' }}>
                                        <option value="dropdown">Dropdown</option>
                                        <option value="selection">Selection (Pills)</option>
                                        <option value="color">Color Bubbles</option>
                                        <option value="radio">Radio Bubbles</option>
                                        <option value="textbox">Textbox</option>
                                    </select>
                                </div>
                                <button type="button" onClick={() => setOptions(options.filter((_, i) => i !== optIndex))} style={{ alignSelf: 'flex-end', padding: '0.6rem', background: '#fee', color: '#e33', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                            </div>
                            
                            {opt.type !== 'textbox' && (
                                <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #eee' }}>
                                    <label style={{ fontSize: '0.9rem', color: '#444', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Option Values</label>
                                    {opt.values.map((val: any, valIndex: number) => (
                                        <div key={valIndex} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                            {opt.type === 'color' && (
                                                <input type="color" value={val.colorHex || '#000000'} onChange={e => updateOptionValue(optIndex, valIndex, 'colorHex', e.target.value)} style={{ width: '40px', height: '40px', border: 'none', padding: 0, cursor: 'pointer', borderRadius: '4px' }} title="Pick Color" />
                                            )}
                                            <input type="text" placeholder="Value (e.g. Red)" value={val.value} onChange={e => updateOptionValue(optIndex, valIndex, 'value', e.target.value)} style={{ flex: 2, padding: '0.5rem', border: '1px solid #e1e1e1', borderRadius: '4px' }} />
                                            <input type="number" placeholder="Price Modifier (+)" value={val.priceModifier} onChange={e => updateOptionValue(optIndex, valIndex, 'priceModifier', Number(e.target.value))} style={{ flex: 1, padding: '0.5rem', border: '1px solid #e1e1e1', borderRadius: '4px' }} />
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addOptionValue(optIndex)} className="btn-admin" style={{ border: '1px solid #ccc', background: 'white', marginTop: '0.5rem' }}>+ Add Value</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => router.back()} className="btn-admin" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', background: '#f1f1f1', border: 'none' }}>Cancel</button>
                    <button type="submit" disabled={isSaving} className="btn-admin btn-admin-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Saving...' : 'Save Product'}</button>
                </div>
            </form>
        </div>
    );
}

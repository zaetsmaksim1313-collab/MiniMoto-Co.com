'use client';

import { useState, useEffect } from 'react';
import { addProduct, deleteProduct, updateProduct } from './actions';

export default function AdminPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [options, setOptions] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            });
    }, []);

    const handleAddOption = () => {
        setOptions([...options, { name: '', values: [] }]);
    };

    const updateOptionName = (idx: number, name: string) => {
        const newOptions = [...options];
        newOptions[idx].name = name;
        setOptions(newOptions);
    };

    const updateOptionValues = (idx: number, valuesStr: string) => {
        const newOptions = [...options];
        newOptions[idx].values = valuesStr.split(',').map(v => {
            const parts = v.trim().split(':');
            const value = parts[0].trim();
            const priceModifier = parts[1] ? Number(parts[1].trim()) : undefined;
            return { value, priceModifier };
        });
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('options', JSON.stringify(options));
        formData.set('images', images.join(','));

        const res = editingProduct
            ? await updateProduct(formData)
            : await addProduct(formData);

        if (res.success) {
            alert(editingProduct ? 'Product updated!' : 'Product added!');
            window.location.reload();
        } else {
            alert("Error: " + res.error);
        }
    };

    const startEdit = (product: any) => {
        setEditingProduct(product);
        setOptions(product.options || []);
        setImages(product.images || []);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setOptions([]);
        setImages([]);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setImages(prev => [...prev, reader.result as string]);
            reader.readAsDataURL(file);
        });
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

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Admin <span style={{ color: 'var(--accent-color)' }}>Dashboard</span></h1>
                <button onClick={() => showForm ? closeForm() : setShowForm(true)} className="btn btn-primary">
                    {showForm ? 'Cancel' : '+ Add New Product'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', marginBottom: '3rem', maxWidth: '800px' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Product ID (URL slug)</label>
                            <input name="id" defaultValue={editingProduct?.id} readOnly={!!editingProduct} placeholder="e.g. mini-talaria-x3" style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid #ccc', color: '#000', borderRadius: '4px', opacity: editingProduct ? 0.6 : 1 }} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Name</label>
                            <input name="name" defaultValue={editingProduct?.name} placeholder="Product Name" style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid #ccc', color: '#000', borderRadius: '4px' }} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Price ($)</label>
                            <input name="price" type="number" step="any" defaultValue={editingProduct?.price} placeholder="2999" style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid #ccc', color: '#000', borderRadius: '4px' }} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Category</label>
                            <input name="category" defaultValue={editingProduct?.category} placeholder="Bikes / Gear / Parts" style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid #ccc', color: '#000', borderRadius: '4px' }} required />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Description</label>
                        <textarea name="description" defaultValue={editingProduct?.description} rows={4} style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid #ccc', color: '#000', borderRadius: '4px' }} required></textarea>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Media</label>
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            style={{ border: `2px dashed ${isDragging ? '#000' : '#ccc'}`, padding: '2rem', textAlign: 'center', borderRadius: '8px', marginBottom: '1rem', background: isDragging ? '#f0f0f0' : '#fff', transition: 'all 0.2s ease', cursor: 'pointer', color: '#000' }}
                            onClick={() => document.getElementById('modal-file-upload')?.click()}
                        >
                            <input id="modal-file-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                            <p style={{ margin: 0, fontWeight: 'bold' }}>Drop images here</p>
                            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>or click to select from your computer.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {images.map((img, i) => (
                                <div key={i} style={{ position: 'relative' }}>
                                    <img src={img} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', border: '1px solid #ccc', borderRadius: '4px' }} />
                                    <button type="button" onClick={(e) => { e.stopPropagation(); setImages(images.filter((_, idx) => idx !== i)); }} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: '10px' }}>X</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem' }}>Options / Variants</h3>
                            <button type="button" onClick={handleAddOption} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.7rem' }}>+ Add Option Group</button>
                        </div>
                        {options.map((opt, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <input placeholder="Option Name (e.g. Color)" value={opt.name} onChange={(e) => updateOptionName(idx, e.target.value)} style={{ flex: 1, padding: '0.6rem', background: '#fff', border: '1px solid #ccc', color: '#000', borderRadius: '4px' }} />
                                <input placeholder="Values (Red, Blue:100, Green:-50)" defaultValue={opt.values?.map((v: any) => `${v.value}${v.priceModifier ? `:${v.priceModifier}` : ''}`).join(', ')} onChange={(e) => updateOptionValues(idx, e.target.value)} style={{ flex: 2, padding: '0.6rem', background: '#fff', border: '1px solid #ccc', color: '#000', borderRadius: '4px' }} />
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{editingProduct ? 'Update Product' : 'Create Product'}</button>
                </form>
            )}

            {/* Product List */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '1rem' }}>Product</th>
                        <th style={{ padding: '1rem' }}>Price</th>
                        <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '1rem' }}>
                                <div style={{ fontWeight: '700' }}>{p.name}</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{p.id}</div>
                            </td>
                            <td style={{ padding: '1rem' }}>${Number(p.price).toFixed(2)}</td>
                            <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => startEdit(p)} style={{ background: 'transparent', color: 'var(--accent-color)', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Edit</button>
                                    <button onClick={() => deleteProduct(p.id).then(() => window.location.reload())} style={{ background: 'transparent', color: '#ff4b2b', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

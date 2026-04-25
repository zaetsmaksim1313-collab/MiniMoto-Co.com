import { getProducts } from "@/lib/products";

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    let products = await getProducts();
    const resolvedParams = await searchParams;
    const category = resolvedParams.category;

    if (category) {
        products = products.filter(p => p.category === category);
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 className="section-title">
                {category ? category.toUpperCase() : 'ALL'} <span style={{ color: 'var(--accent-color)' }}>{category ? '' : 'PRODUCTS'}</span>
            </h1>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem'
            }}>
                {products.map(product => (
                    <a key={product.id} href={`/products/${product.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s' }} className="product-card">
                        <div style={{
                            aspectRatio: '4/5',
                            width: '100%',
                            background: `url(${product.images[0]}) no-repeat center/cover`,
                            marginBottom: '1rem',
                            position: 'relative'
                        }}>
                            {/* Example placeholder for out of stock logic if status was used for inventory */}
                            {product.status === 'Draft' && (
                                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'black', color: 'white', padding: '4px 8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    SOLD OUT
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '0 0.25rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{product.name}</h3>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <p style={{ color: '#333', fontSize: '0.9rem' }}>${Number(product.price).toFixed(2)}</p>
                                {product.compareAtPrice && (
                                    <p style={{ color: '#999', fontSize: '0.9rem', textDecoration: 'line-through' }}>${Number(product.compareAtPrice).toFixed(2)}</p>
                                )}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

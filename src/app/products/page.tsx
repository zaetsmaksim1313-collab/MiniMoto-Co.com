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
            <style>{`
                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    width: 100%;
                }
                .product-item {
                    display: flex;
                    flex-direction: column;
                    text-decoration: none;
                    color: inherit;
                }
                .product-image-container {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1/1;
                    overflow: hidden;
                    background: #f5f5f5;
                    margin-bottom: 0.75rem;
                }
                .product-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .sold-out-badge {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: black;
                    color: white;
                    font-size: 0.7rem;
                    font-weight: 800;
                    padding: 4px 8px;
                    text-transform: uppercase;
                }
                @media (max-width: 1024px) {
                    .product-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 768px) {
                    .product-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 480px) {
                    .product-grid { grid-template-columns: repeat(1, 1fr); gap: 2rem; }
                }
            `}</style>
            <div className="product-grid">
                {products.map(product => (
                    <a href={`/products/${product.id}`} key={product.id} className="product-item">
                        <div className="product-image-container">
                            {product.images && product.images.length > 0 && (
                                <img 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    className="product-image"
                                />
                            )}
                            {product.status === 'Draft' && (
                                <div className="sold-out-badge">
                                    SOLD OUT
                                </div>
                            )}
                        </div>
                        
                        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: '900', textTransform: 'uppercase', margin: 0, letterSpacing: '0.02em' }}>{product.name}</h3>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <p style={{ color: '#333', fontSize: '0.85rem', margin: 0 }}>${Number(product.price).toFixed(2)}</p>
                                {product.compareAtPrice && (
                                    <p style={{ color: '#999', fontSize: '0.85rem', textDecoration: 'line-through', margin: 0 }}>${Number(product.compareAtPrice).toFixed(2)}</p>
                                )}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

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
                display: 'flex',
                flexDirection: 'column',
                gap: '6rem',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {products.map(product => (
                    <div key={product.id} className="product-catalog-item" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '0 0.25rem', textAlign: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{product.name}</h3>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
                                <p style={{ color: '#333', fontSize: '1.2rem', fontWeight: 'bold' }}>${Number(product.price).toFixed(2)}</p>
                                {product.compareAtPrice && (
                                    <p style={{ color: '#999', fontSize: '1.2rem', textDecoration: 'line-through' }}>${Number(product.compareAtPrice).toFixed(2)}</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Display ALL images straight down */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                            {product.images.map((img, idx) => (
                                <img 
                                    key={idx}
                                    src={img} 
                                    alt={`${product.name} photo ${idx + 1}`}
                                    style={{ width: '100%', height: 'auto', display: 'block' }} 
                                />
                            ))}
                        </div>

                        {/* Example placeholder for out of stock logic if status was used for inventory */}
                        {product.status === 'Draft' && (
                            <div style={{ alignSelf: 'center', background: 'black', color: 'white', padding: '8px 16px', fontSize: '1rem', fontWeight: 'bold', marginTop: '1rem' }}>
                                SOLD OUT
                            </div>
                        )}
                        {product.status !== 'Draft' && (
                            <a href={`/products/${product.id}`} style={{ 
                                display: 'inline-block', 
                                padding: '1.2rem', 
                                background: 'black', 
                                color: 'white', 
                                textDecoration: 'none', 
                                textAlign: 'center', 
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                marginTop: '1rem'
                            }}>
                                BUILD YOURS / BUY NOW
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

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
                {category ? category.toUpperCase() : 'ALL'} <span style={{ color: 'var(--accent-color)' }}>PRODUCTS</span>
            </h1>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2rem'
            }}>
                {products.map(product => (
                    <div key={product.id} className="glass" style={{ padding: '1rem', transition: 'var(--transition)' }}>
                        <div style={{
                            height: '300px',
                            background: `url(${product.images[0]}) no-repeat center/contain`,
                            borderRadius: '8px',
                            marginBottom: '1rem'
                        }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                                <p style={{ opacity: 0.6, fontSize: '0.8rem', marginBottom: '1rem' }}>{product.category}</p>
                            </div>
                            <p style={{ color: 'var(--accent-color)', fontWeight: '700', fontSize: '1.2rem' }}>${product.price}</p>
                        </div>
                        <a href={`/products/${product.id}`} className="btn btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', width: '100%' }}>View Details</a>
                    </div>
                ))}
            </div>
        </div>
    );
}

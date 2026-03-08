import { getProducts } from "@/lib/products";
import Link from "next/link";

export default async function CollectionsPage() {
    const products = await getProducts();
    const categories = Array.from(new Set(products.map(p => p.category)));

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 className="section-title">Product <span style={{ color: 'var(--accent-color)' }}>Collections</span></h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem'
            }}>
                {categories.map(category => (
                    <Link key={category} href={`/products?category=${category}`} className="glass" style={{
                        padding: '3rem',
                        textAlign: 'center',
                        textDecoration: 'none',
                        transition: 'var(--transition)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '250px'
                    }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-color)' }}>{category}</h2>
                        <span className="btn btn-outline">Explore Collection</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

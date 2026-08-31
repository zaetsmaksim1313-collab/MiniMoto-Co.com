import { getMakeItYoursImages } from "@/lib/products";
import SettingsForm from "./SettingsForm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SettingsPage() {
    const images = await getMakeItYoursImages();

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Visual Settings</h1>
            </div>
            
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: 0 }}>1/1 Custom Decal Lab &amp; Builds Showcase (Homepage)</h2>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
                    Upload, switch, or replace photos for the 4 Before &amp; After comparison builds displayed on the homepage.
                </p>

                <SettingsForm initialImages={images} />
            </div>
        </div>
    );
}

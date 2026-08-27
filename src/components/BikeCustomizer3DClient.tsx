'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useConfiguratorStore, BIKE_COLORS } from '@/lib/configuratorStore';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

// Dynamically import Canvas to disable SSR for WebGL window dependencies
const BikeCanvas = dynamic(() => import('./BikeCanvas'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      minHeight: '500px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0c',
      color: '#fff',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <p style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8, margin: 0 }}>
        Loading Building Lab...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

export default function BikeCustomizer3DClient() {
  const store = useConfiguratorStore();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleSaveAndCheckout = () => {
    const options: Record<string, string> = {
      'Frame Color': store.frameColor.name,
      'Chi Battery Upgrade': store.chiBattery ? 'Yes (+$4.00)' : 'No',
      'EBMX Controller': store.ebmxController ? 'Yes (+$5.00)' : 'No',
      'Skid Plate Cover': store.motorCover ? 'Yes (+$2.00)' : 'No',
      'Fox 40 Suspension': store.fox40 ? 'Yes (+$5.00)' : 'No',
      'Shvftwork Handlebars': store.shvftworkBars ? 'Yes (+$3.00)' : 'No',
    };

    addToCart({
      id: `custom-surron-${Date.now()}`,
      name: 'Custom Built Surron LBX',
      price: store.getTotalPrice(),
      images: ['/MOTOCUTZ DECAL.png'],
    }, options);

    alert('Custom Build added to cart!');
    router.push('/cart');
  };

  const resetView = () => store.resetSelections();

  // ── Inline style objects ──────────────────────────────────────────────────
  const S = {
    wrapper: {
      minHeight: '100vh',
      background: '#0a0a0c',
      display: 'flex',
      flexDirection: 'column' as const,
      color: '#ffffff',
    },
    layout: {
      display: 'flex',
      flex: 1,
      height: 'calc(100vh - 0px)',
      overflow: 'hidden' as const,
    } as React.CSSProperties,
    visualizer: {
      flex: 1.6,
      position: 'relative' as const,
      background: '#0a0a0c',
      borderRight: '1px solid #1a1a1f',
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: '480px',
    },
    overlayBar: {
      position: 'absolute' as const,
      top: '1.5rem',
      left: '1.5rem',
      display: 'flex',
      gap: '0.75rem',
      zIndex: 50,
    },
    btnOverlay: {
      padding: '8px 16px',
      background: 'rgba(18,18,22,0.85)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '6px',
      color: '#fff',
      fontSize: '0.85rem',
      fontWeight: 600,
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
    } as React.CSSProperties,
    canvasWrapper: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    panel: {
      flex: 1,
      maxWidth: '440px',
      background: '#0a0a0c',
      borderLeft: '1px solid #1a1a1f',
      display: 'flex',
      flexDirection: 'column' as const,
      overflowY: 'auto' as const,
    },
    panelInner: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      padding: '2.5rem 2rem',
    },
    panelH1: {
      fontSize: '2.2rem',
      fontWeight: 950,
      fontStyle: 'italic' as const,
      letterSpacing: '-0.03em',
      textTransform: 'uppercase' as const,
      margin: '0 0 2rem 0',
      color: '#ffffff',
    },
    sectionLabel: {
      fontSize: '0.95rem',
      fontWeight: 800,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      color: '#88888b',
      margin: '0 0 1rem 0',
    },
    sectionDivider: {
      marginBottom: '2rem',
      paddingBottom: '1.5rem',
      borderBottom: '1px solid #1a1a1f',
    },
    titleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    colorsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
      gap: '0.6rem',
    },
    upgradesList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.8rem',
    },
    upgradeCard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#121215',
      border: '1px solid #1a1a1f',
      borderRadius: '8px',
      padding: '1rem',
      cursor: 'pointer',
      userSelect: 'none' as const,
    },
    cardInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.25rem',
    },
    cardTitle: { fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' },
    cardDesc: { fontSize: '0.75rem', color: '#88888b' },
    footer: {
      marginTop: 'auto',
      borderTop: '1px solid #1a1a1f',
      paddingTop: '1.5rem',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.9rem',
      color: '#88888b',
      marginBottom: '0.5rem',
    },
    upgradeRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.8rem',
      color: 'rgba(255,255,255,0.6)',
      marginBottom: '0.5rem',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '1.3rem',
      fontWeight: 800,
      color: '#ffffff',
      marginTop: '1rem',
      marginBottom: '1.5rem',
      borderTop: '1px solid #1a1a1f',
      paddingTop: '1rem',
    },
    btnCheckout: {
      width: '100%',
      padding: '1.1rem',
      background: '#ffffff',
      color: '#000000',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: 900,
      fontStyle: 'italic' as const,
      textTransform: 'uppercase' as const,
      cursor: 'pointer',
    },
  };

  return (
    <div style={S.wrapper}>
      <main style={S.layout}>

        {/* 3D Visualizer */}
        <section style={S.visualizer}>
          <div style={S.overlayBar}>
            <Link href="/" style={S.btnOverlay}>← Back to site</Link>
            <button style={S.btnOverlay} onClick={resetView}>⟳ Reset view</button>
            <button style={S.btnOverlay} onClick={() => alert('Inspector active: Rotate model to inspect components.')}>🔍 Inspector</button>
          </div>
          <div style={S.canvasWrapper}>
            <BikeCanvas />
          </div>
        </section>

        {/* Config Side Panel */}
        <section style={S.panel}>
          <div style={S.panelInner}>

            <div><h1 style={S.panelH1}>Build your Surron</h1></div>

            {/* Frame Color */}
            <div style={S.sectionDivider}>
              <div style={S.titleRow}>
                <h2 style={S.sectionLabel}>Frame Color</h2>
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{store.frameColor.name}</span>
              </div>
              <div style={S.colorsGrid}>
                {BIKE_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => store.setFrameColor(color)}
                    aria-label={`Set frame to ${color.name}`}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      backgroundColor: color.hex,
                      border: store.frameColor.name === color.name
                        ? '2px solid #ffffff'
                        : '2px solid transparent',
                      transform: store.frameColor.name === color.name ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: store.frameColor.name === color.name
                        ? '0 0 0 2px #0a0a0c, 0 0 10px rgba(255,255,255,0.4)'
                        : 'inset 0 2px 4px rgba(0,0,0,0.3)',
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Upgrades */}
            <div style={S.sectionDivider}>
              <h2 style={S.sectionLabel}>Upgrades</h2>
              <div style={S.upgradesList}>
                {[
                  { label: 'Chi Battery', desc: 'Add a Chi battery — +$4', active: store.chiBattery, toggle: store.toggleChiBattery },
                  { label: 'EBMX Controller', desc: 'Add EBMX Controller — +$5', active: store.ebmxController, toggle: store.toggleEbmxController },
                  { label: 'Motor Cover', desc: 'Add Motor Cover — +$2', active: store.motorCover, toggle: store.toggleMotorCover },
                  { label: 'Fox 40', desc: 'Add Fox 40 — +$5', active: store.fox40, toggle: store.toggleFox40 },
                  { label: 'Shvftwork Bars', desc: 'Add Shvftwork Bars — +$3', active: store.shvftworkBars, toggle: store.toggleShvftworkBars },
                ].map(({ label, desc, active, toggle }) => (
                  <div key={label} style={S.upgradeCard} onClick={toggle}>
                    <div style={S.cardInfo}>
                      <span style={S.cardTitle}>{label}</span>
                      <span style={S.cardDesc}>{desc}</span>
                    </div>
                    {/* Toggle switch */}
                    <div style={{
                      width: '44px', height: '24px',
                      background: active ? '#ffffff' : '#2a2a30',
                      borderRadius: '12px',
                      position: 'relative',
                      transition: 'background 0.2s ease',
                      flexShrink: 0,
                    }}>
                      <div style={{
                        width: '18px', height: '18px',
                        background: active ? '#000000' : '#ffffff',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '3px',
                        left: '3px',
                        transform: active ? 'translateX(20px)' : 'translateX(0)',
                        transition: 'transform 0.2s ease, background 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary & Checkout */}
            <div style={S.footer}>
              <div style={S.summaryRow}><span>Stock Surron</span><span>$25.00</span></div>
              {store.chiBattery && <div style={S.upgradeRow}><span>+ Chi Battery Upgrade</span><span>$4.00</span></div>}
              {store.ebmxController && <div style={S.upgradeRow}><span>+ EBMX Controller</span><span>$5.00</span></div>}
              {store.motorCover && <div style={S.upgradeRow}><span>+ Skid Motor Cover</span><span>$2.00</span></div>}
              {store.fox40 && <div style={S.upgradeRow}><span>+ Fox 40 Suspension</span><span>$5.00</span></div>}
              {store.shvftworkBars && <div style={S.upgradeRow}><span>+ Shvftwork Handlebars</span><span>$3.00</span></div>}
              <div style={S.totalRow}><span>Total</span><span>${store.getTotalPrice().toFixed(2)}</span></div>
              <button style={S.btnCheckout} onClick={handleSaveAndCheckout}>
                Save design &amp; checkout
              </button>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

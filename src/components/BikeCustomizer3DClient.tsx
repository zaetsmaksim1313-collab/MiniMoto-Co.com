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
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0c] text-white" style={{ minHeight: '500px' }}>
      <div className="text-center" style={{ padding: '4rem 0' }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem auto'
        }}></div>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>Loading Building Lab...</p>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  ),
});

export default function BikeCustomizer3DClient() {
  const store = useConfiguratorStore();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleSaveAndCheckout = () => {
    // 1. Compile options list
    const options: Record<string, string> = {
      'Frame Color': store.frameColor.name,
      'Chi Battery Upgrade': store.chiBattery ? 'Yes (+$4.00)' : 'No',
      'EBMX Controller': store.ebmxController ? 'Yes (+$5.00)' : 'No',
      'Skid Plate Cover': store.motorCover ? 'Yes (+$2.00)' : 'No',
      'Fox 40 Suspension': store.fox40 ? 'Yes (+$5.00)' : 'No',
      'Shvftwork Handlebars': store.shvftworkBars ? 'Yes (+$3.00)' : 'No',
    };

    // 2. Add to cart
    addToCart({
      id: `custom-surron-${Date.now()}`,
      name: 'Custom Built Surron LBX',
      price: store.getTotalPrice(),
      images: ['/MOTOCUTZ DECAL.png'] // fallback placeholder, 3D customizer default image
    }, options);

    alert('Custom Build added to cart!');
    router.push('/cart');
  };

  const resetView = () => {
    store.resetSelections();
  };

  return (
    <div className="lab-wrapper">
      <main className="lab-layout">
        
        {/* 3D Model Visualizer Screen */}
        <section className="visualizer-section">
          {/* Overlay controls */}
          <div className="overlay-bar">
            <Link href="/" className="btn-overlay">
              ← Back to site
            </Link>
            <button className="btn-overlay" onClick={resetView}>
              ⟳ Reset view
            </button>
            <button className="btn-overlay" onClick={() => alert("Inspector active: Rotate model to inspect components.")}>
              🔍 Inspector
            </button>
          </div>

          <div className="canvas-wrapper">
            <BikeCanvas />
          </div>
        </section>

        {/* Configurations Side Control Board */}
        <section className="configurator-panel">
          <div className="configurator-container">
            
            {/* Header */}
            <div className="panel-header">
              <h1>Build your Surron</h1>
            </div>

            {/* Colors Section */}
            <div className="panel-section">
              <div className="section-title-row">
                <h2>Frame Color</h2>
                <span className="selection-val">{store.frameColor.name}</span>
              </div>
              <div className="colors-grid">
                {BIKE_COLORS.map((color) => (
                  <button
                    key={color.name}
                    className={`color-dot ${store.frameColor.name === color.name ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => store.setFrameColor(color)}
                    aria-label={`Set frame to ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Upgrades Section */}
            <div className="panel-section">
              <h2>Upgrades</h2>
              <div className="upgrades-list">
                
                {/* Upgrade 1: Chi Battery */}
                <div className="upgrade-card" onClick={store.toggleChiBattery}>
                  <div className="card-info">
                    <span className="card-title">Chi</span>
                    <span className="card-desc">Add a Chi battery — +$4</span>
                  </div>
                  <button className={`toggle-switch ${store.chiBattery ? 'on' : ''}`}>
                    <span className="switch-knob" />
                  </button>
                </div>

                {/* Upgrade 2: EBMX Controller */}
                <div className="upgrade-card" onClick={store.toggleEbmxController}>
                  <div className="card-info">
                    <span className="card-title">EBMX Controller</span>
                    <span className="card-desc">Add EBMX Controller — +$5</span>
                  </div>
                  <button className={`toggle-switch ${store.ebmxController ? 'on' : ''}`}>
                    <span className="switch-knob" />
                  </button>
                </div>

                {/* Upgrade 3: Motor Cover */}
                <div className="upgrade-card" onClick={store.toggleMotorCover}>
                  <div className="card-info">
                    <span className="card-title">Motor Cover</span>
                    <span className="card-desc">Add Motor Cover — +$2</span>
                  </div>
                  <button className={`toggle-switch ${store.motorCover ? 'on' : ''}`}>
                    <span className="switch-knob" />
                  </button>
                </div>

                {/* Upgrade 4: Fox 40 Forks */}
                <div className="upgrade-card" onClick={store.toggleFox40}>
                  <div className="card-info">
                    <span className="card-title">Fox 40</span>
                    <span className="card-desc">Add Fox 40 — +$5</span>
                  </div>
                  <button className={`toggle-switch ${store.fox40 ? 'on' : ''}`}>
                    <span className="switch-knob" />
                  </button>
                </div>

                {/* Upgrade 5: Shvftwork Handlebars */}
                <div className="upgrade-card" onClick={store.toggleShvftworkBars}>
                  <div className="card-info">
                    <span className="card-title">Shvftwork Bars</span>
                    <span className="card-desc">Add Shvftwork Bars — +$3</span>
                  </div>
                  <button className={`toggle-switch ${store.shvftworkBars ? 'on' : ''}`}>
                    <span className="switch-knob" />
                  </button>
                </div>

              </div>
            </div>

            {/* Price Calculations & Order Footer */}
            <div className="panel-footer">
              <div className="summary-row">
                <span>Stock Surron</span>
                <span>$25.00</span>
              </div>
              
              {store.chiBattery && (
                <div className="summary-row upgrade-row">
                  <span>+ Chi Battery Upgrade</span>
                  <span>$4.00</span>
                </div>
              )}
              {store.ebmxController && (
                <div className="summary-row upgrade-row">
                  <span>+ EBMX Controller</span>
                  <span>$5.00</span>
                </div>
              )}
              {store.motorCover && (
                <div className="summary-row upgrade-row">
                  <span>+ Skid Motor Cover</span>
                  <span>$2.00</span>
                </div>
              )}
              {store.fox40 && (
                <div className="summary-row upgrade-row">
                  <span>+ Fox 40 Suspension</span>
                  <span>$5.00</span>
                </div>
              )}
              {store.shvftworkBars && (
                <div className="summary-row upgrade-row">
                  <span>+ Shvftwork Handlebars</span>
                  <span>$3.00</span>
                </div>
              )}

              <div className="total-row">
                <span>Total</span>
                <span>${store.getTotalPrice().toFixed(2)}</span>
              </div>

              <button className="btn-checkout" onClick={handleSaveAndCheckout}>
                Save design & checkout
              </button>
            </div>

          </div>
        </section>

      </main>

      <style jsx>{`
        .lab-wrapper {
          min-height: 100vh;
          background: #0a0a0c;
          display: flex;
          flex-direction: column;
          color: #ffffff;
        }

        .lab-layout {
          display: flex;
          flex: 1;
          height: calc(100vh - 80px); /* Adjust based on navbar height */
          overflow: hidden;
        }

        @media (max-width: 900px) {
          .lab-layout {
            flex-direction: column;
            height: auto;
            overflow: visible;
          }
        }

        .visualizer-section {
          flex: 1.6;
          position: relative;
          background: #0a0a0c;
          border-right: 1px solid #1a1a1f;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 900px) {
          .visualizer-section {
            min-height: 480px;
          }
        }

        .canvas-wrapper {
          flex: 1;
          width: 100%;
          height: 100%;
        }

        .overlay-bar {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          display: flex;
          gap: 0.75rem;
          z-index: 50;
        }

        .btn-overlay {
          padding: 8px 16px;
          background: rgba(18, 18, 22, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .btn-overlay:hover {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
        }

        .configurator-panel {
          flex: 1;
          max-width: 440px;
          background: #0a0a0c;
          border-left: 1px solid #1a1a1f;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        @media (max-width: 900px) {
          .configurator-panel {
            max-width: 100%;
            border-left: none;
            border-top: 1px solid #1a1a1f;
          }
        }

        .configurator-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2.5rem 2rem;
        }

        .panel-header h1 {
          font-size: 2.2rem;
          font-weight: 950;
          font-style: italic;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          margin: 0 0 2rem 0;
          color: #ffffff;
        }

        .panel-section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #1a1a1f;
        }

        .panel-section h2 {
          font-size: 0.95rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #88888b;
          margin: 0 0 1rem 0;
        }

        .section-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-title-row h2 {
          margin: 0;
        }

        .selection-val {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ffffff;
        }

        .colors-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.6rem;
        }

        .color-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }

        .color-dot:hover {
          transform: scale(1.1);
        }

        .color-dot.active {
          transform: scale(1.1);
          border-color: #ffffff;
          box-shadow: 0 0 0 2px #0a0a0c, 0 0 10px rgba(255,255,255,0.4);
        }

        .upgrades-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .upgrade-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #121215;
          border: 1px solid #1a1a1f;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .upgrade-card:hover {
          border-color: #333339;
          background: #16161a;
        }

        .card-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .card-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: #ffffff;
        }

        .card-desc {
          font-size: 0.75rem;
          color: #88888b;
        }

        .toggle-switch {
          width: 44px;
          height: 24px;
          background: #2a2a30;
          border-radius: 12px;
          border: none;
          position: relative;
          cursor: pointer;
          transition: background 0.2s ease;
          padding: 0;
        }

        .toggle-switch.on {
          background: #ffffff;
        }

        .switch-knob {
          width: 18px;
          height: 18px;
          background: #ffffff;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: transform 0.2s ease, background 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .toggle-switch.on .switch-knob {
          transform: translateX(20px);
          background: #000000;
        }

        .panel-footer {
          margin-top: auto;
          background: #0a0a0c;
          border-top: 1px solid #1a1a1f;
          padding-top: 1.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #88888b;
          margin-bottom: 0.5rem;
        }

        .upgrade-row {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.6);
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 1.3rem;
          font-weight: 800;
          color: #ffffff;
          margin-top: 1rem;
          margin-bottom: 1.5rem;
          border-top: 1px solid #1a1a1f;
          padding-top: 1rem;
        }

        .btn-checkout {
          width: 100%;
          padding: 1.1rem;
          background: #ffffff;
          color: #000000;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 900;
          font-style: italic;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-checkout:hover {
          background: #e5e5e5;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255,255,255,0.15);
        }
      `}</style>
    </div>
  );
}

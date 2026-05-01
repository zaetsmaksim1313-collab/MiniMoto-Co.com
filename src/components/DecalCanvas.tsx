'use client';

import { useState, useRef, useEffect, PointerEvent as ReactPointerEvent } from 'react';
import Link from 'next/link';

interface CanvasItem {
    id: string;
    type: 'text' | 'sponsor' | 'image';
    content: string;
    x: number;
    y: number;
    color: string;
    fontFamily?: string;
    fontSize?: number;
    rotation?: number;
    width?: number;
}

const FONTS = ['Impact', 'Arial', 'Courier New', 'Bebas Neue', 'Trebuchet MS'];
const PLATE_COLORS = ['#ffffff', '#000000'];

export default function DecalCanvas() {
    const [items, setItems] = useState<CanvasItem[]>([]);
    const [plateColor, setPlateColor] = useState('#000000');
    const [template, setTemplate] = useState<'ODI' | 'MotoCutz'>('ODI');
    
    // Add Tool State
    const [numberInput, setNumberInput] = useState('1');
    const [selectedFont, setSelectedFont] = useState(FONTS[0]);
    const [selectedColor, setSelectedColor] = useState('#000000');
    
    // Drag Engine State
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [itemStartPos, setItemStartPos] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);
    
    // Dynamic Mask State
    const [masks, setMasks] = useState<Record<string, string>>({});

    const logosList = [
        { src: '/ALPLINE%20STARS%20LOGO.png', key: 'Alpinestars', width: 100 },
        { src: '/CHI%20LOGO.png', key: 'CHI', width: 80 },
        { src: '/EXT%20LOGO.png', key: 'EXT Racing', width: 120 },
        { src: '/FOX%20LOGO.png', key: 'Fox', width: 100 },
        { src: '/MONSTER%20LOGO.png', key: 'Monster Energy', width: 120 },
        { src: '/PRICKLY%20LOGO%202.png', key: 'Prickly 2', width: 100 },
        { src: '/PRICKLY%20LOGO.png', key: 'Prickly', width: 100 },
        { src: '/THRILL%20SEEKERS%20LOGO.png', key: 'Thrill Seekers', width: 120 },
        { src: '/W9%20LOGO.png', key: 'W9', width: 80 },
    ];

    // Process images into pure solid masks
    useEffect(() => {
        const generateSilhouette = (src: string, key: string) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const w = canvas.width;
                const h = canvas.height;

                const visited = new Uint8Array(w * h);
                const queue: {x: number, y: number}[] = [];

                // Auto-detect background color from the top-left pixel
                const bgR = data[0];
                const bgG = data[1];
                const bgB = data[2];

                const isBg = (x: number, y: number) => {
                    const idx = (y * w + x) * 4;
                    if (data[idx+3] < 50) return true; // transparent is bg
                    
                    // Check if pixel is similar to the top-left background color
                    const diffR = Math.abs(data[idx] - bgR);
                    const diffG = Math.abs(data[idx+1] - bgG);
                    const diffB = Math.abs(data[idx+2] - bgB);
                    if (diffR < 35 && diffG < 35 && diffB < 35) return true;
                    
                    // Fallback: any very bright pixel is considered background
                    if (data[idx] > 220 && data[idx+1] > 220 && data[idx+2] > 220) return true; 
                    
                    return false;
                };

                for (let x = 0; x < w; x++) {
                    if (isBg(x, 0)) { queue.push({x, y: 0}); visited[x] = 1; }
                    if (isBg(x, h - 1)) { queue.push({x, y: h - 1}); visited[(h - 1) * w + x] = 1; }
                }
                for (let y = 0; y < h; y++) {
                    if (isBg(0, y)) { queue.push({x: 0, y}); visited[y * w] = 1; }
                    if (isBg(w - 1, y)) { queue.push({x: w - 1, y}); visited[y * w + (w - 1)] = 1; }
                }

                let head = 0;
                while (head < queue.length) {
                    const {x, y} = queue[head++];
                    const idx = (y * w + x) * 4;
                    data[idx + 3] = 0; // make background transparent

                    const neighbors = [
                        {nx: x + 1, ny: y}, {nx: x - 1, ny: y},
                        {nx: x, ny: y + 1}, {nx: x, ny: y - 1}
                    ];

                    for (const {nx, ny} of neighbors) {
                        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                            const nIdx = ny * w + nx;
                            if (!visited[nIdx]) {
                                visited[nIdx] = 1;
                                if (isBg(nx, ny)) queue.push({x: nx, y: ny});
                            }
                        }
                    }
                }

                // Now, instead of filling all !visited with black,
                // we find the largest connected component of !visited (the plate itself)
                // and erase any smaller isolated artifacts (like corner logos or noise).
                const plateVisited = new Uint8Array(w * h);
                let maxArea = 0;
                let largestComponentId = 0;
                let currentComponentId = 1;
                const componentMap = new Int32Array(w * h);

                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        const i = y * w + x;
                        if (!visited[i] && !plateVisited[i]) {
                            let area = 0;
                            const compQueue = [{x, y}];
                            plateVisited[i] = 1;

                            let qHead = 0;
                            while (qHead < compQueue.length) {
                                const curr = compQueue[qHead++];
                                const cIdx = curr.y * w + curr.x;
                                componentMap[cIdx] = currentComponentId;
                                area++;

                                const nbs = [
                                    {nx: curr.x + 1, ny: curr.y}, {nx: curr.x - 1, ny: curr.y},
                                    {nx: curr.x, ny: curr.y + 1}, {nx: curr.x, ny: curr.y - 1}
                                ];

                                for (const {nx, ny} of nbs) {
                                    if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                                        const nIdx = ny * w + nx;
                                        if (!visited[nIdx] && !plateVisited[nIdx]) {
                                            plateVisited[nIdx] = 1;
                                            compQueue.push({x: nx, y: ny});
                                        }
                                    }
                                }
                            }

                            if (area > maxArea) {
                                maxArea = area;
                                largestComponentId = currentComponentId;
                            }
                            currentComponentId++;
                        }
                    }
                }

                // Fill ONLY the largest plate component with solid black, make rest transparent
                for (let i = 0; i < w * h; i++) {
                    const idx = i * 4;
                    if (componentMap[i] === largestComponentId) {
                        data[idx] = 0;
                        data[idx+1] = 0;
                        data[idx+2] = 0;
                        data[idx+3] = 255;
                    } else {
                        data[idx+3] = 0;
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                setMasks(prev => ({ ...prev, [key]: canvas.toDataURL('image/png') }));
            };
            img.src = src;
        };

        generateSilhouette('/MOTOCUTZ%20DECAL.png', 'MotoCutz');
        generateSilhouette('/ODI%20DECAL.png', 'ODI');
    }, []);

    // Add Functions
    const addNumber = () => {
        if (!numberInput.trim()) return;
        setItems(prev => [...prev, {
            id: 'item_' + Date.now(),
            type: 'text',
            content: numberInput,
            x: 100,
            y: 150,
            color: selectedColor,
            fontFamily: selectedFont,
            fontSize: 120,
            rotation: 0
        }]);
    };

    const addSponsor = (sponsorName: string) => {
        setItems(prev => [...prev, {
            id: 'item_' + Date.now(),
            type: 'sponsor',
            content: sponsorName,
            x: 120,
            y: 300,
            color: '#000000',
            fontSize: 24,
            rotation: 0
        }]);
    };

    const addLogo = (logoPath: string, defaultWidth: number) => {
        setItems(prev => [...prev, {
            id: 'item_' + Date.now(),
            type: 'image',
            content: logoPath,
            x: 90,
            y: 200,
            color: selectedColor, // Used to determine if we should invert color
            width: defaultWidth,
            rotation: 0
        }]);
    };

    const deleteItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    // --- Drag & Drop Engine (Touch & Mouse Support) ---
    const handlePointerDown = (id: string, e: ReactPointerEvent<HTMLDivElement>) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        setDraggingId(id);
        setStartPos({ x: e.clientX, y: e.clientY });
        setItemStartPos({ x: item.x, y: item.y });
        
        // Capture pointer so dragging continues even if cursor leaves the element fast
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!draggingId) return;
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;

        setItems(prev => prev.map(item => 
            item.id === draggingId 
                ? { ...item, x: itemStartPos.x + dx, y: itemStartPos.y + dy } 
                : item
        ));
    };

    const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
        setDraggingId(null);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    const handleSaveAsJSON = () => {
        const designObject = {
            basePlateColor: plateColor,
            canvasItems: items
        };
        console.log("FINAL DECAL JSON TO SAVE/ORDER:", designObject);
        alert("Plate Design Saved! Check developer console to see the JSON serialization output that will be attached to checkout.");
    };

    return (
        <div className="decal-wrapper">
            <main className="decal-layout">
                {/* Visual Canvas Area */}
                <section className="canvas-section">
                    <div className="canvas-container">
                        <div style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.1))' }}>
                            {/* The Front Plate */}
                            <div 
                                className="front-plate" 
                                ref={canvasRef}
                                style={{ 
                                    backgroundColor: plateColor,
                                    WebkitMaskImage: masks[template] ? `url(${masks[template]})` : 'none',
                                    WebkitMaskSize: 'contain',
                                    WebkitMaskPosition: 'center',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskImage: masks[template] ? `url(${masks[template]})` : 'none',
                                    maskSize: 'contain',
                                    maskPosition: 'center',
                                    maskRepeat: 'no-repeat',
                                    opacity: masks[template] ? 1 : 0.5,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    className="canvas-node"
                                    style={{
                                        left: item.x,
                                        top: item.y,
                                        color: item.color,
                                        fontFamily: item.fontFamily || 'sans-serif',
                                        fontSize: `${item.fontSize}px`,
                                        transform: `rotate(${item.rotation || 0}deg)`,
                                        fontWeight: item.type === 'text' ? 900 : 700,
                                        cursor: draggingId === item.id ? 'grabbing' : 'grab',
                                        border: draggingId === item.id ? '1px dashed #000' : 'none',
                                        padding: draggingId === item.id ? '4px' : '0'
                                    }}
                                    onPointerDown={(e) => handlePointerDown(item.id, e)}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    onPointerCancel={handlePointerUp}
                                    onDoubleClick={() => deleteItem(item.id)}
                                >
                                    {item.type === 'sponsor' && <div className="sponsor-badge">{item.content}</div>}
                                    {item.type === 'text' && <span>{item.content}</span>}
                                    {item.type === 'image' && (
                                        <img 
                                            src={item.content} 
                                            alt="Custom Logo" 
                                            style={{ 
                                                width: `${item.width}px`,
                                                filter: item.color === '#ffffff' ? 'brightness(0) invert(1)' : 'none',
                                                pointerEvents: 'none'
                                            }} 
                                        />
                                    )}
                                </div>
                            ))}
                            </div>
                        </div>
                        <p className="canvas-hint">Drag items to move. Double-click to delete.</p>
                    </div>
                </section>

                {/* Sidebar Tools */}
                <section className="tools-section">
                    <div className="tools-header">
                        <Link href="/" className="back-link">← Back</Link>
                        <h1>Decal Lab</h1>
                        <p>Design your custom race plate.</p>
                    </div>

                    <div className="tool-group">
                        <h3>1. Plate Template</h3>
                        <div className="template-toggle">
                            <button 
                                className={`btn-template ${template === 'ODI' ? 'active' : ''}`}
                                onClick={() => setTemplate('ODI')}
                            >
                                ODI Plate
                            </button>
                            <button 
                                className={`btn-template ${template === 'MotoCutz' ? 'active' : ''}`}
                                onClick={() => setTemplate('MotoCutz')}
                            >
                                MotoCutz Plate
                            </button>
                        </div>
                        <h3 style={{ marginTop: '1.5rem' }}>2. Plate Color</h3>
                        <div className="color-swatches">
                            {PLATE_COLORS.map(color => (
                                <button
                                    key={color}
                                    className={`swatch ${plateColor === color ? 'active' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setPlateColor(color)}
                                    aria-label="Set Background Color"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="tool-group">
                        <h3>3. Racing Number</h3>
                        <div className="number-tool">
                            <input 
                                type="text" 
                                value={numberInput} 
                                onChange={(e) => setNumberInput(e.target.value)} 
                                placeholder="Your #"
                                className="input-field"
                                maxLength={3}
                            />
                            <select 
                                value={selectedFont} 
                                onChange={(e) => setSelectedFont(e.target.value)}
                                className="input-field"
                            >
                                {FONTS.map(font => <option key={font} value={font}>{font}</option>)}
                            </select>
                            <input 
                                type="color" 
                                value={selectedColor} 
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="color-picker"
                            />
                            <button className="btn-add" onClick={addNumber}>Add Number</button>
                        </div>
                    </div>

                    <div className="tool-group">
                        <h3>4. Add Custom Logos</h3>
                        <div className="sponsor-list">
                            {logosList.map(logo => (
                                <button 
                                    key={logo.key}
                                    className="btn-sponsor" 
                                    onClick={() => addLogo(logo.src, logo.width)}
                                >
                                    + {logo.key}
                                </button>
                            ))}
                        </div>
                        <p style={{ fontSize: '0.75rem', marginTop: '1rem', color: '#666' }}>Note: Logos invert to white if the color picker is set to white (#ffffff).</p>
                    </div>

                    <div className="checkout-footer">
                        <div className="price-summary">
                            <span>Custom Plate Decal</span>
                            <span className="total-price">$49.99</span>
                        </div>
                        <button className="btn-save" onClick={handleSaveAsJSON}>Save & Add to Cart</button>
                    </div>
                </section>
            </main>

            <style jsx>{`
                .decal-wrapper {
                    min-height: 100vh;
                    background: #f4f4f5;
                    display: flex;
                    flex-direction: column;
                }

                .decal-layout {
                    display: flex;
                    flex: 1;
                    height: calc(100vh - 80px);
                    overflow: hidden;
                }

                @media (max-width: 900px) {
                    .decal-layout {
                        flex-direction: column;
                        height: auto;
                        overflow: visible;
                    }
                }

                .canvas-section {
                    flex: 1.5;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at 50% 50%, #eaeaea 0%, #dbdbdc 100%);
                }

                @media (max-width: 900px) {
                    .canvas-section {
                        min-height: 500px;
                        padding: 2rem 0;
                    }
                }

                .canvas-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }

                .front-plate {
                    width: 320px;
                    height: 320px;
                    background: white;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    touch-action: none; /* Crucial for preventing scroll during drag on mobile */
                }

                .canvas-node {
                    position: absolute;
                    user-select: none;
                    line-height: 1;
                    /* Prevent text highlighting during drag */
                    -webkit-user-select: none; 
                }

                .sponsor-badge {
                    background: black;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: 800;
                    letter-spacing: 1px;
                }

                .canvas-hint {
                    color: #888;
                    font-size: 0.85rem;
                    text-align: center;
                }

                .tools-section {
                    flex: 1;
                    max-width: 450px;
                    background: #ffffff;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                    box-shadow: -20px 0 40px rgba(0,0,0,0.02);
                    z-index: 10;
                }

                @media (max-width: 900px) {
                    .tools-section {
                        max-width: 100%;
                    }
                }

                .tools-header {
                    padding: 2rem;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }

                .back-link {
                    font-size: 0.85rem;
                    color: #666;
                    text-decoration: none;
                    margin-bottom: 1rem;
                    display: inline-block;
                }

                .tools-header h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    margin: 0 0 0.5rem 0;
                }

                .tool-group {
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }

                .tool-group h3 {
                    font-size: 0.95rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin: 0 0 1rem 0;
                }

                .color-swatches {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .swatch {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: 2px solid #e5e5e5;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .swatch.active {
                    transform: scale(1.15);
                    border: 3px solid #000;
                }

                .template-toggle {
                    display: flex;
                    gap: 1rem;
                }

                .btn-template {
                    flex: 1;
                    padding: 0.8rem;
                    background: #fff;
                    color: #000;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-template.active {
                    background: #000;
                    color: #fff;
                    border-color: #000;
                }

                .number-tool {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr auto;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .input-field {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 0.95rem;
                    width: 100%;
                }

                .color-picker {
                    width: 40px;
                    height: 40px;
                    padding: 0;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }

                .btn-add {
                    grid-column: span 3;
                    padding: 10px;
                    background: #f4f4f5;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .btn-add:hover {
                    background: #e5e5e5;
                }

                .sponsor-list {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                }

                .btn-sponsor {
                    padding: 12px;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-sponsor:hover {
                    border-color: #000;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }

                .checkout-footer {
                    margin-top: auto;
                    padding: 2rem;
                    background: #fff;
                    box-shadow: 0 -10px 30px rgba(0,0,0,0.03);
                }

                .price-summary {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                .total-price {
                    font-size: 1.5rem;
                    font-weight: 800;
                }

                .btn-save {
                    width: 100%;
                    padding: 1rem;
                    background: #000;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .btn-save:hover {
                    background: #333;
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
}

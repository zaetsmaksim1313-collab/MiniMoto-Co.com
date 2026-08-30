'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useConfiguratorStore } from '@/lib/configuratorStore';

// ─────────────────────────────────────────────────────────
// Tube: cylinder placed between two 3D world-space points
// ─────────────────────────────────────────────────────────
const _yUp = new THREE.Vector3(0, 1, 0);
function Tube({
  a, b, r = 0.018, color = '#e0e0e0', roughness = 0.3, metalness = 0.2,
}: { a: [number,number,number]; b: [number,number,number]; r?: number; color?: string; roughness?: number; metalness?: number }) {
  const d = useMemo(() => {
    const av = new THREE.Vector3(...a), bv = new THREE.Vector3(...b);
    const mid: [number,number,number] = [(av.x+bv.x)/2,(av.y+bv.y)/2,(av.z+bv.z)/2];
    const dir = bv.clone().sub(av); const len = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(_yUp, dir.normalize());
    const eu = new THREE.Euler().setFromQuaternion(q);
    return { mid, rot:[eu.x,eu.y,eu.z] as [number,number,number], len };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[a[0],a[1],a[2],b[0],b[1],b[2]]);
  return (
    <mesh position={d.mid} rotation={d.rot} castShadow>
      <cylinderGeometry args={[r, r, d.len, 8]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────
// FramePanel: the characteristic Sur-ron frame profile
// extruded from a 2D shape with cutouts
// Shape coords: [localX = bikeZ, localY = bikeY]
// After rotation [0,-PI/2,0] the shape lies in the YZ plane
// ─────────────────────────────────────────────────────────
function FramePanel({ color }: { color: string }) {
  const { shape, opts } = useMemo(() => {
    const s = new THREE.Shape();
    // Outer frame outline — Sur-ron LBX silhouette
    s.moveTo( 0.54, 1.16);  // head tube top
    s.lineTo( 0.63, 0.76);  // head tube bottom
    s.lineTo( 0.18, 0.56);  // down-tube / BB front
    s.lineTo( 0.00, 0.52);  // BB bottom
    s.lineTo(-0.65, 0.38);  // rear dropout
    s.lineTo(-0.52, 0.82);  // seatstay junction
    s.lineTo(-0.48, 1.02);  // subframe upper
    s.lineTo(-0.18, 1.22);  // seat root
    s.closePath();

    // Large center cutout — the signature Sur-ron hole
    const h1 = new THREE.Path();
    h1.moveTo( 0.40, 1.08);
    h1.lineTo( 0.52, 0.82);
    h1.lineTo( 0.16, 0.68);
    h1.lineTo(-0.04, 0.72);
    h1.lineTo(-0.04, 1.06);
    h1.closePath();
    s.holes.push(h1);

    // Lower rear triangle cutout
    const h2 = new THREE.Path();
    h2.moveTo(-0.10, 0.96);
    h2.lineTo(-0.44, 0.56);
    h2.lineTo(-0.62, 0.44);
    h2.lineTo(-0.62, 0.64);
    h2.lineTo(-0.42, 0.82);
    h2.lineTo(-0.10, 1.00);
    h2.closePath();
    s.holes.push(h2);

    const opts = { depth: 0.11, bevelEnabled: true, bevelThickness: 0.010, bevelSize: 0.009, bevelSegments: 3 };
    return { shape: s, opts };
  }, []);

  return (
    // position.x = +half-depth to center the 0.11-unit extrusion on x=0
    <mesh position={[0.055, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
      <extrudeGeometry args={[shape, opts]} />
      <meshPhysicalMaterial color={color} roughness={0.18} metalness={0.14} clearcoat={0.92} clearcoatRoughness={0.06} />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────
// Wheel: knobby torus + spokes + hub
// ─────────────────────────────────────────────────────────
function Wheel({ pos, outerR = 0.36, tubeR = 0.078, spokes = 18 }: {
  pos: [number,number,number]; outerR?: number; tubeR?: number; spokes?: number;
}) {
  const rimR = outerR - tubeR * 0.85;
  const angles = useMemo(() => Array.from({length:spokes},(_,i)=>(i/spokes)*Math.PI*2),[spokes]);
  return (
    <group position={pos} rotation={[Math.PI/2, 0, 0]}>
      {/* Knobby tire */}
      <mesh castShadow>
        <torusGeometry args={[outerR - tubeR*0.5, tubeR, 18, 64]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.97} />
      </mesh>
      {/* Rim hoop */}
      <mesh castShadow>
        <torusGeometry args={[rimR, 0.011, 8, 64]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.4} metalness={0.84} />
      </mesh>
      {/* Hub */}
      <mesh castShadow>
        <cylinderGeometry args={[0.042, 0.042, 0.17, 20]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.14} metalness={0.94} />
      </mesh>
      {/* Spokes */}
      {angles.map((a,i)=>(
        <mesh key={i} rotation={[0,0,a]}>
          <boxGeometry args={[0.004, rimR-0.04, 0.003]} />
          <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.88} />
        </mesh>
      ))}
      {/* Axle */}
      <mesh castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.24, 8]} />
        <meshStandardMaterial color="#e2e2e2" roughness={0.09} metalness={0.97} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────
// Rotor: floating disc with inner ring cutout
// ─────────────────────────────────────────────────────────
function Rotor({ pos, r = 0.18 }: { pos:[number,number,number]; r?: number }) {
  return (
    <group position={pos} rotation={[Math.PI/2, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[r, r, 0.005, 32]} />
        <meshStandardMaterial color="#c6c6c6" roughness={0.17} metalness={0.88} />
      </mesh>
      <mesh>
        <torusGeometry args={[r-0.04, 0.013, 6, 32]} />
        <meshStandardMaterial color="#181818" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────
// BikeModel — main exported component
// ─────────────────────────────────────────────────────────
export default function BikeModel() {
  const { frameColor, chiBattery, ebmxController, motorCover, fox40, shvftworkBars } = useConfiguratorStore();
  const FC = frameColor.hex;

  // Bike coordinate constants (all local to the <group> below)
  const WR  = 0.36;   // wheel outer radius
  const TR  = 0.076;  // tire tube radius
  const WY  = WR;     // wheel center Y (wheels sit on ground at y=0)
  const FWZ = 0.72;   // front wheel Z
  const RWZ = -0.68;  // rear wheel Z

  // Battery lives inside the upper-front frame opening
  const BAT_Y = 0.92, BAT_Z = 0.28;
  // Motor / BB
  const MOT_Y = WY + 0.18, MOT_Z = 0.10;

  return (
    <group position={[0, -WY + 0.01, 0]}>

      {/* ── DISPLAY PLATFORM ─────────────────────────────────────── */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,0]} receiveShadow>
        <planeGeometry args={[4.2, 2.8]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.66} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.002,0]}>
        <ringGeometry args={[1.92, 1.96, 4, 1]} />
        <meshStandardMaterial color="#2c2c38" />
      </mesh>

      {/* ── PADDOCK STAND ────────────────────────────────────────── */}
      {/* two crossed legs going from swingarm pivot to ground */}
      <Tube a={[-0.05, WY, 0.05]} b={[-0.20, 0.02, -0.22]} r={0.018} color="#0d0d0f" roughness={0.5} metalness={0.4} />
      <Tube a={[ 0.05, WY, 0.05]} b={[ 0.20, 0.02, -0.22]} r={0.018} color="#0d0d0f" roughness={0.5} metalness={0.4} />
      <Tube a={[-0.20,0.02,-0.22]} b={[ 0.20,0.02,-0.22]} r={0.015} color="#0d0d0f" roughness={0.5} metalness={0.4} />
      <Tube a={[-0.20,0.02,-0.22]} b={[-0.20,0.02, 0.16]} r={0.015} color="#0d0d0f" roughness={0.5} metalness={0.4} />
      <Tube a={[ 0.20,0.02,-0.22]} b={[ 0.20,0.02, 0.16]} r={0.015} color="#0d0d0f" roughness={0.5} metalness={0.4} />
      <Tube a={[-0.20,0.02, 0.16]} b={[ 0.20,0.02, 0.16]} r={0.015} color="#0d0d0f" roughness={0.5} metalness={0.4} />

      {/* ── WHEELS ───────────────────────────────────────────────── */}
      <Wheel pos={[0, WY, FWZ]} outerR={WR} tubeR={TR} />
      <Wheel pos={[0, WY, RWZ]} outerR={WR} tubeR={TR} />
      <Rotor pos={[0.095, WY, FWZ]} r={0.20} />
      <Rotor pos={[0.095, WY, RWZ]} r={0.17} />

      {/* Rear sprocket */}
      <mesh position={[-0.075, WY, RWZ]} rotation={[Math.PI/2,0,0]} castShadow>
        <cylinderGeometry args={[0.165, 0.165, 0.007, 32]} />
        <meshStandardMaterial color="#181818" roughness={0.5} metalness={0.72} />
      </mesh>

      {/* ── MAIN FRAME PANEL (extruded Sur-ron shape) ─────────────── */}
      <FramePanel color={FC} />

      {/* ── FRONT FORK ───────────────────────────────────────────── */}
      {/* Upper triple clamp */}
      <mesh position={[0, 1.13, 0.48]} castShadow>
        <boxGeometry args={[0.23, 0.042, 0.073]} />
        <meshStandardMaterial color="#0d0d10" roughness={0.36} />
      </mesh>
      {/* Lower crown */}
      <mesh position={[0, 0.87, 0.57]} castShadow>
        <boxGeometry args={[0.22, 0.038, 0.062]} />
        <meshStandardMaterial color="#0d0d10" roughness={0.36} />
      </mesh>
      {/* Fork legs */}
      {([-0.090, 0.090] as number[]).map((x, i) => {
        const topClr  = fox40 ? '#c04600' : '#141416';
        const botClr  = fox40 ? '#ca8c14' : '#d2d2d2';
        return (
          <group key={i}>
            <Tube a={[x,0.88,0.56]} b={[x,WY+0.068,FWZ-0.024]} r={fox40?0.025:0.020} color={topClr} roughness={0.34} metalness={0.56} />
            <Tube a={[x,WY+0.068,FWZ-0.024]} b={[x,WY+0.010,FWZ]} r={fox40?0.018:0.016} color={botClr} roughness={0.07} metalness={0.93} />
          </group>
        );
      })}
      {/* Front fender */}
      <mesh position={[0, WY+WR*0.72, FWZ-0.02]} rotation={[0.30,0,0]} castShadow>
        <boxGeometry args={[0.195, 0.034, 0.29]} />
        <meshPhysicalMaterial color={FC} roughness={0.18} metalness={0.12} clearcoat={0.8} />
      </mesh>
      {/* Number plate */}
      <mesh position={[0, WY+WR*0.55, FWZ*0.79]} rotation={[-0.18,0,0]} castShadow>
        <boxGeometry args={[0.195, 0.26, 0.013]} />
        <meshPhysicalMaterial color={FC} roughness={0.14} clearcoat={0.72} />
      </mesh>

      {/* ── BATTERY (visible through frame cutout) ────────────────── */}
      <mesh position={[0, BAT_Y, BAT_Z]} rotation={[0.06,0,0]} castShadow>
        <boxGeometry args={chiBattery ? [0.085,0.30,0.18] : [0.075,0.26,0.16]} />
        <meshPhysicalMaterial
          color={chiBattery ? '#880000' : '#141830'}
          roughness={0.24} metalness={0.74} clearcoat={0.5}
        />
      </mesh>

      {/* ── MOTOR ────────────────────────────────────────────────── */}
      <mesh position={[0, MOT_Y, MOT_Z]} rotation={[0,0,Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.098, 0.098, 0.16, 24]} />
        <meshStandardMaterial color="#212420" roughness={0.38} metalness={0.70} />
      </mesh>
      {motorCover && (
        <mesh position={[0, MOT_Y-0.12, MOT_Z+0.02]} rotation={[0.08,0,0]} castShadow>
          <boxGeometry args={[0.16, 0.027, 0.28]} />
          <meshStandardMaterial color="#e2e2e2" roughness={0.11} metalness={0.88} />
        </mesh>
      )}

      {/* ── CONTROLLER ───────────────────────────────────────────── */}
      {ebmxController ? (
        <group position={[0, 0.82, -0.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.11, 0.17, 0.08]} />
            <meshPhysicalMaterial color="#5600a0" roughness={0.13} metalness={0.92} clearcoat={0.5} />
          </mesh>
          {([-0.038, 0, 0.038] as number[]).map((x,i)=>(
            <mesh key={i} position={[x,0,0.044]} castShadow>
              <boxGeometry args={[0.009,0.13,0.011]} />
              <meshPhysicalMaterial color="#5600a0" roughness={0.13} metalness={0.92} clearcoat={0.5} />
            </mesh>
          ))}
        </group>
      ) : (
        <mesh position={[0, 0.80, -0.16]} castShadow>
          <boxGeometry args={[0.10, 0.13, 0.07]} />
          <meshStandardMaterial color="#0a0a0c" roughness={0.64} />
        </mesh>
      )}

      {/* ── SWINGARM ─────────────────────────────────────────────── */}
      <Tube a={[-0.048, MOT_Y, MOT_Z]} b={[-0.062, WY+0.01, RWZ]} r={0.017} color="#141418" roughness={0.44} metalness={0.50} />
      <Tube a={[ 0.048, MOT_Y, MOT_Z]} b={[ 0.062, WY+0.01, RWZ]} r={0.017} color="#141418" roughness={0.44} metalness={0.50} />

      {/* ── REAR SHOCK ───────────────────────────────────────────── */}
      <Tube
        a={[0, 0.84, -0.06]}
        b={[0, WY+0.26, RWZ*0.40]}
        r={0.015} color="#cccccc" roughness={0.10} metalness={0.90}
      />
      {[0,1,2,3,4].map(i=>(
        <mesh key={i} position={[0, 0.80-i*0.048, -0.10-i*0.028]} rotation={[0.45,0,0]} castShadow>
          <torusGeometry args={[0.028,0.0068,8,22]} />
          <meshStandardMaterial color="#bb1300" roughness={0.26} />
        </mesh>
      ))}

      {/* ── SEAT ─────────────────────────────────────────────────── */}
      <mesh position={[0,1.24,-0.30]} rotation={[-0.055,0,0]} castShadow>
        <boxGeometry args={[0.148,0.020,0.50]} />
        <meshStandardMaterial color="#111114" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0,1.275,-0.30]} rotation={[-0.055,0,0]} castShadow>
        <boxGeometry args={[0.134,0.044,0.48]} />
        <meshStandardMaterial color="#0e0e10" roughness={0.92} />
      </mesh>

      {/* ── HANDLEBARS ───────────────────────────────────────────── */}
      <group position={[0, 1.22, 0.40]}>
        <mesh position={[0,0.06,0]} castShadow>
          <boxGeometry args={[0.038,0.115,0.038]} />
          <meshStandardMaterial color="#0d0d10" roughness={0.38} />
        </mesh>
        <mesh position={[0,0.134,0]} castShadow>
          <boxGeometry args={[0.058,0.026,0.048]} />
          <meshStandardMaterial color="#0d0d10" roughness={0.38} />
        </mesh>
        {/* Main bar */}
        <mesh position={[0,0.136,0]} rotation={[0,0,Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.013,0.013,0.74,14]} />
          <meshStandardMaterial
            color={shvftworkBars ? '#0086bb' : '#111114'}
            roughness={0.29} metalness={0.84}
          />
        </mesh>
        {/* Bar pad */}
        <mesh position={[0,0.136,0]} rotation={[0,0,Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.023,0.023,0.155,12]} />
          <meshStandardMaterial color="#212126" roughness={0.92} />
        </mesh>
        {/* Grips */}
        {([-0.348, 0.348] as number[]).map((gx,i)=>(
          <mesh key={i} position={[gx,0.136,0]} rotation={[0,0,Math.PI/2]} castShadow>
            <cylinderGeometry args={[0.019,0.019,0.085,14]} />
            <meshStandardMaterial color="#111111" roughness={0.94} />
          </mesh>
        ))}
        {/* Brake levers */}
        <Tube a={[-0.30,0.136,0]} b={[-0.36,0.098,0.055]} r={0.007} color="#888" roughness={0.3} metalness={0.8} />
        <Tube a={[ 0.30,0.136,0]} b={[ 0.36,0.098,0.055]} r={0.007} color="#888" roughness={0.3} metalness={0.8} />
      </group>

    </group>
  );
}

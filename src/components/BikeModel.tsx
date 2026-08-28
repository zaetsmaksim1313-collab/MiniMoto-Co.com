'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useConfiguratorStore } from '@/lib/configuratorStore';

// ─────────────────────────────────────────────
// Tube helper – places a cylinder between two 3D points
// ─────────────────────────────────────────────
const Y_UP = new THREE.Vector3(0, 1, 0);

interface TubeProps {
  start: [number, number, number];
  end: [number, number, number];
  radius?: number;
  color?: string;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
}

function Tube({ start, end, radius = 0.022, color = '#e8e8e8', roughness = 0.25, metalness = 0.15, clearcoat = 0.6 }: TubeProps) {
  const { mid, rot, len } = useMemo(() => {
    const s = new THREE.Vector3(start[0], start[1], start[2]);
    const e = new THREE.Vector3(end[0], end[1], end[2]);
    const mid: [number, number, number] = [(s.x + e.x) / 2, (s.y + e.y) / 2, (s.z + e.z) / 2];
    const dir = e.clone().sub(s);
    const len = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(Y_UP, dir.normalize());
    const eu = new THREE.Euler().setFromQuaternion(q);
    return { mid, rot: [eu.x, eu.y, eu.z] as [number, number, number], len };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start[0], start[1], start[2], end[0], end[1], end[2]]);

  return (
    <mesh position={mid} rotation={rot} castShadow>
      <cylinderGeometry args={[radius, radius, len, 10]} />
      <meshPhysicalMaterial color={color} roughness={roughness} metalness={metalness} clearcoat={clearcoat} clearcoatRoughness={0.1} />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// Spoked Wheel
// ─────────────────────────────────────────────
function Wheel({ pos, r = 0.40, tube = 0.11, spokes = 20 }: {
  pos: [number, number, number]; r?: number; tube?: number; spokes?: number;
}) {
  const spokeAngles = useMemo(() => Array.from({ length: spokes }, (_, i) => (i / spokes) * Math.PI * 2), [spokes]);
  const rimR = r - tube * 0.9;

  return (
    <group position={pos} rotation={[Math.PI / 2, 0, 0]}>
      {/* Chunky knobby tire */}
      <mesh castShadow>
        <torusGeometry args={[r, tube, 14, 56]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.96} />
      </mesh>
      {/* Rim */}
      <mesh castShadow>
        <torusGeometry args={[rimR, 0.012, 8, 56]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Hub shell */}
      <mesh castShadow>
        <cylinderGeometry args={[0.048, 0.048, 0.16, 20]} />
        <meshStandardMaterial color="#c8c8c8" roughness={0.15} metalness={0.92} />
      </mesh>
      {/* Spokes */}
      {spokeAngles.map((a, i) => (
        <mesh key={i} rotation={[0, 0, a]} castShadow>
          <boxGeometry args={[0.005, rimR - 0.04, 0.003]} />
          <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.85} />
        </mesh>
      ))}
      {/* Axle */}
      <mesh castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.24, 8]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.1} metalness={0.96} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────
// Brake Rotor
// ─────────────────────────────────────────────
function Rotor({ pos, r = 0.19 }: { pos: [number, number, number]; r?: number }) {
  return (
    <group position={pos} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[r, r, 0.005, 36]} />
        <meshStandardMaterial color="#c2c2c2" roughness={0.2} metalness={0.88} />
      </mesh>
      {/* Rotor cutouts (aesthetic disc rings) */}
      <mesh>
        <torusGeometry args={[r - 0.04, 0.015, 6, 36]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────
// Main BikeModel
// ─────────────────────────────────────────────
export default function BikeModel() {
  const { frameColor, chiBattery, ebmxController, motorCover, fox40, shvftworkBars } = useConfiguratorStore();
  const FC = frameColor.hex;

  // ── Geometry constants ─────────────────────────────────────────────────
  const WR = 0.40;    // wheel radius
  const TT = 0.112;   // tire tube thickness
  const WY = WR;      // wheel center Y (sits on ground at y=0)
  const FWZ = 0.70;   // front wheel Z
  const RWZ = -0.68;  // rear wheel Z

  // Frame anchor points  [x, y, z]
  //   Bike faces +Z. Ground = y=0. Wheels at y=WR.
  const HT_TOP:  [number,number,number] = [0, 1.14, 0.54];   // head tube top
  const HT_BOT:  [number,number,number] = [0, 0.78, 0.62];   // head tube bottom
  const TT_END:  [number,number,number] = [0, 1.18, -0.16];  // top tube rear / seat root
  const ST_BOT:  [number,number,number] = [0, 0.68, -0.10];  // seat tube bottom / bb area
  const BB:      [number,number,number] = [0, 0.58, 0.10];   // bottom bracket / motor
  const SF_TOP:  [number,number,number] = [0, 1.00, -0.46];  // subframe rear top
  const SF_BOT:  [number,number,number] = [0, 0.70, -0.46];  // subframe rear bottom
  const RA_L:    [number,number,number] = [-0.062, WY, RWZ]; // rear axle left
  const RA_R:    [number,number,number] = [0.062, WY, RWZ];  // rear axle right

  // Convenience: fork mount point (below lower clamp)
  const FORK_MNT: [number,number,number] = [0, HT_BOT[1] + 0.10, HT_BOT[2] - 0.03];

  // ─────────────────────────────────────────────────────────────────────
  return (
    <group position={[0, -WY + 0.01, 0]}>

      {/* ── DISPLAY PLATFORM ─────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[4.2, 2.8]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.65} />
      </mesh>
      {/* Subtle platform edge highlight */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[1.92, 1.96, 4, 1]} />
        <meshStandardMaterial color="#303038" />
      </mesh>

      {/* ── PADDOCK STAND ─────────────────────────────────────────────── */}
      <group position={[0, WY, -0.05]}>
        <Tube start={[-0.06, -WY + 0.01, 0]} end={[-0.20, -WY * 0.6, -0.22]} radius={0.020} color="#0c0c0d" roughness={0.5} metalness={0.4} clearcoat={0} />
        <Tube start={[0.06, -WY + 0.01, 0]}  end={[0.20, -WY * 0.6, -0.22]}  radius={0.020} color="#0c0c0d" roughness={0.5} metalness={0.4} clearcoat={0} />
        <Tube start={[-0.20, -WY * 0.6, -0.22]} end={[-0.20, -WY * 0.6, 0.18]} radius={0.018} color="#0c0c0d" roughness={0.5} metalness={0.4} clearcoat={0} />
        <Tube start={[0.20, -WY * 0.6, -0.22]}  end={[0.20, -WY * 0.6, 0.18]}  radius={0.018} color="#0c0c0d" roughness={0.5} metalness={0.4} clearcoat={0} />
        <Tube start={[-0.20, -WY * 0.6, 0.18]} end={[0.20, -WY * 0.6, 0.18]} radius={0.016} color="#0c0c0d" roughness={0.5} metalness={0.4} clearcoat={0} />
        <Tube start={[-0.20, -WY * 0.6, -0.22]} end={[0.20, -WY * 0.6, -0.22]} radius={0.016} color="#0c0c0d" roughness={0.5} metalness={0.4} clearcoat={0} />
      </group>

      {/* ── WHEELS ────────────────────────────────────────────────────── */}
      <Wheel pos={[0, WY, FWZ]} r={WR} tube={TT} />
      <Wheel pos={[0, WY, RWZ]} r={WR} tube={TT} />

      {/* Brake rotors */}
      <Rotor pos={[0.10, WY, FWZ]} r={0.21} />
      <Rotor pos={[0.10, WY, RWZ]} r={0.18} />

      {/* Rear sprocket */}
      <mesh position={[-0.08, WY, RWZ]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.007, 32]} />
        <meshStandardMaterial color="#181818" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* ── FRONT FORK ────────────────────────────────────────────────── */}
      {/* Upper triple clamp */}
      <mesh position={[0, HT_TOP[1] - 0.01, HT_TOP[2] - 0.06]} castShadow>
        <boxGeometry args={[0.24, 0.045, 0.08]} />
        <meshStandardMaterial color="#0e0e0f" roughness={0.4} />
      </mesh>
      {/* Lower triple clamp */}
      <mesh position={[0, HT_BOT[1] + 0.14, HT_BOT[2] - 0.04]} castShadow>
        <boxGeometry args={[0.24, 0.042, 0.08]} />
        <meshStandardMaterial color="#0e0e0f" roughness={0.4} />
      </mesh>

      {/* Fork legs × 2 */}
      {([-0.095, 0.095] as number[]).map((x, i) => {
        const forkTop: [number, number, number] = [x, FORK_MNT[1], FORK_MNT[2]];
        const forkWrist: [number, number, number] = [x, WY + 0.065, FWZ - 0.03];
        const forkAxle: [number, number, number] = [x, WY + 0.015, FWZ];
        const forkColor = fox40 ? '#c55200' : '#111114';
        const stanchionColor = fox40 ? '#d49020' : '#cccccc';
        return (
          <group key={i}>
            <Tube start={forkTop} end={forkWrist} radius={fox40 ? 0.026 : 0.022} color={forkColor} roughness={0.35} metalness={0.55} clearcoat={0} />
            <Tube start={forkWrist} end={forkAxle} radius={fox40 ? 0.020 : 0.018} color={stanchionColor} roughness={0.08} metalness={0.92} clearcoat={0} />
          </group>
        );
      })}

      {/* Front fender */}
      <mesh position={[0, WY + WR * 0.74, FWZ - 0.03]} rotation={[0.32, 0, 0]} castShadow>
        <boxGeometry args={[0.20, 0.038, 0.32]} />
        <meshPhysicalMaterial color={FC} roughness={0.18} metalness={0.12} clearcoat={0.8} />
      </mesh>

      {/* Number plate */}
      <mesh position={[0, WY + WR * 0.58, FWZ * 0.84]} rotation={[-0.18, 0, 0]} castShadow>
        <boxGeometry args={[0.20, 0.28, 0.014]} />
        <meshPhysicalMaterial color={FC} roughness={0.15} clearcoat={0.7} />
      </mesh>

      {/* ── HEAD TUBE ─────────────────────────────────────────────────── */}
      <Tube start={HT_TOP} end={HT_BOT} radius={0.042} color={FC} roughness={0.2} metalness={0.14} clearcoat={0.8} />

      {/* ── MAIN FRAME ────────────────────────────────────────────────── */}
      {/* Top tube */}
      <Tube start={HT_TOP} end={TT_END} radius={0.026} color={FC} roughness={0.2} metalness={0.14} clearcoat={0.8} />
      {/* Down tube */}
      <Tube start={HT_BOT} end={BB} radius={0.034} color={FC} roughness={0.2} metalness={0.14} clearcoat={0.8} />
      {/* Seat tube */}
      <Tube start={TT_END} end={ST_BOT} radius={0.026} color={FC} roughness={0.2} metalness={0.14} clearcoat={0.8} />
      {/* Diagonal brace inside frame (Sur-ron distinctive inner gusset) */}
      <Tube start={[0, 0.92, 0.24]} end={ST_BOT} radius={0.020} color={FC} roughness={0.2} metalness={0.14} clearcoat={0.8} />
      <Tube start={HT_BOT} end={[0, 0.86, -0.06]} radius={0.020} color={FC} roughness={0.2} metalness={0.14} clearcoat={0.8} />

      {/* Frame panel fill (flat area of the Sur-ron frame) */}
      <mesh position={[0, 0.86, 0.22]} rotation={[0.12, 0, 0]} castShadow>
        <boxGeometry args={[0.18, 0.34, 0.46]} />
        <meshPhysicalMaterial color={FC} roughness={0.22} metalness={0.12} clearcoat={0.75} transparent opacity={1} />
      </mesh>
      {/* Inner cutout illusion – dark inset */}
      <mesh position={[0, 0.90, 0.20]}>
        <boxGeometry args={[0.17, 0.16, 0.24]} />
        <meshStandardMaterial color="#0a0a0c" roughness={1} />
      </mesh>

      {/* Chainstays */}
      <Tube start={BB} end={RA_L} radius={0.020} color={FC} roughness={0.22} metalness={0.14} clearcoat={0.7} />
      <Tube start={BB} end={RA_R} radius={0.020} color={FC} roughness={0.22} metalness={0.14} clearcoat={0.7} />
      {/* Seatstays */}
      <Tube start={SF_BOT} end={RA_L} radius={0.016} color={FC} roughness={0.22} metalness={0.14} clearcoat={0.7} />
      <Tube start={SF_BOT} end={RA_R} radius={0.016} color={FC} roughness={0.22} metalness={0.14} clearcoat={0.7} />
      {/* Rear axle bridge */}
      <Tube start={RA_L} end={RA_R} radius={0.020} color="#181818" roughness={0.45} metalness={0.5} clearcoat={0} />

      {/* ── SUBFRAME ──────────────────────────────────────────────────── */}
      <Tube start={TT_END} end={SF_TOP} radius={0.018} color={FC} roughness={0.22} metalness={0.14} clearcoat={0.7} />
      <Tube start={ST_BOT} end={SF_BOT} radius={0.018} color={FC} roughness={0.22} metalness={0.14} clearcoat={0.7} />
      <Tube start={SF_TOP} end={SF_BOT} radius={0.015} color={FC} roughness={0.22} metalness={0.14} clearcoat={0.7} />

      {/* ── SWINGARM ──────────────────────────────────────────────────── */}
      <Tube start={BB} end={[-0.068, WY + 0.06, RWZ * 0.5]} radius={0.022} color="#141416" roughness={0.45} metalness={0.5} clearcoat={0} />
      <Tube start={BB} end={[0.068, WY + 0.06, RWZ * 0.5]}  radius={0.022} color="#141416" roughness={0.45} metalness={0.5} clearcoat={0} />
      <Tube start={[-0.068, WY + 0.06, RWZ * 0.5]} end={RA_L} radius={0.020} color="#141416" roughness={0.45} metalness={0.5} clearcoat={0} />
      <Tube start={[0.068, WY + 0.06, RWZ * 0.5]}  end={RA_R} radius={0.020} color="#141416" roughness={0.45} metalness={0.5} clearcoat={0} />

      {/* ── REAR SHOCK ────────────────────────────────────────────────── */}
      <Tube
        start={[0, BB[1] + 0.22, BB[2] - 0.14]}
        end={[0, WY + 0.30, RWZ * 0.44]}
        radius={0.018} color="#d0d0d0" roughness={0.12} metalness={0.90} clearcoat={0}
      />
      {/* Spring coils */}
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i}
          position={[0, BB[1] + 0.30 - i * 0.054, BB[2] - 0.17 - i * 0.032]}
          rotation={[0.46, 0, 0]} castShadow>
          <torusGeometry args={[0.034, 0.0075, 8, 22]} />
          <meshStandardMaterial color="#bb1500" roughness={0.28} />
        </mesh>
      ))}

      {/* ── BATTERY PACK ──────────────────────────────────────────────── */}
      <mesh position={[0, BB[1] + 0.24, BB[2] + 0.03]} rotation={[0.10, 0, 0]} castShadow>
        <boxGeometry args={chiBattery ? [0.16, 0.42, 0.22] : [0.14, 0.38, 0.20]} />
        <meshPhysicalMaterial
          color={chiBattery ? '#8b0000' : '#141830'}
          roughness={0.25} metalness={0.72} clearcoat={0.55}
        />
      </mesh>
      {/* Battery connector face */}
      <mesh position={[0, BB[1] + 0.42, BB[2] + 0.12]}>
        <boxGeometry args={[0.10, 0.04, 0.006]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* ── MOTOR ─────────────────────────────────────────────────────── */}
      <mesh position={[0, BB[1] - 0.018, BB[2] - 0.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.105, 0.105, 0.18, 24]} />
        <meshStandardMaterial color="#252826" roughness={0.38} metalness={0.72} />
      </mesh>
      {/* Motor cover/skid plate */}
      {motorCover && (
        <mesh position={[0, BB[1] - 0.12, BB[2] + 0.04]} rotation={[0.10, 0, 0]} castShadow>
          <boxGeometry args={[0.18, 0.030, 0.30]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.12} metalness={0.88} />
        </mesh>
      )}

      {/* ── CONTROLLER ────────────────────────────────────────────────── */}
      {ebmxController ? (
        <group position={[0, BB[1] + 0.10, BB[2] - 0.25]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, 0.20, 0.09]} />
            <meshPhysicalMaterial color="#6200b0" roughness={0.14} metalness={0.92} clearcoat={0.5} />
          </mesh>
          {([-0.045, 0, 0.045] as number[]).map((x, i) => (
            <mesh key={i} position={[x, 0, 0.050]} castShadow>
              <boxGeometry args={[0.010, 0.16, 0.012]} />
              <meshPhysicalMaterial color="#6200b0" roughness={0.14} metalness={0.92} clearcoat={0.5} />
            </mesh>
          ))}
        </group>
      ) : (
        <mesh position={[0, BB[1] + 0.08, BB[2] - 0.22]} castShadow>
          <boxGeometry args={[0.12, 0.16, 0.08]} />
          <meshStandardMaterial color="#0a0a0c" roughness={0.62} />
        </mesh>
      )}

      {/* ── SEAT ──────────────────────────────────────────────────────── */}
      {/* Seat base */}
      <mesh position={[0, TT_END[1] + 0.025, -0.28]} rotation={[-0.05, 0, 0]} castShadow>
        <boxGeometry args={[0.17, 0.022, 0.56]} />
        <meshStandardMaterial color="#111114" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Seat foam/cover */}
      <mesh position={[0, TT_END[1] + 0.056, -0.28]} rotation={[-0.05, 0, 0]} castShadow>
        <boxGeometry args={[0.155, 0.048, 0.54]} />
        <meshStandardMaterial color="#0e0e10" roughness={0.92} />
      </mesh>

      {/* ── HANDLEBARS ────────────────────────────────────────────────── */}
      <group position={[0, HT_TOP[1] + 0.065, HT_TOP[2] - 0.095]}>
        {/* Stem riser */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.042, 0.13, 0.042]} />
          <meshStandardMaterial color="#0e0e0f" roughness={0.4} />
        </mesh>
        {/* Bar clamp */}
        <mesh position={[0, 0.135, 0]} castShadow>
          <boxGeometry args={[0.065, 0.030, 0.055]} />
          <meshStandardMaterial color="#0e0e0f" roughness={0.4} />
        </mesh>
        {/* Main bar */}
        <mesh position={[0, 0.136, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.82, 14]} />
          <meshStandardMaterial
            color={shvftworkBars ? '#0094be' : '#111114'}
            roughness={0.32} metalness={0.82}
          />
        </mesh>
        {/* Crossbar pad */}
        <mesh position={[0, 0.136, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.18, 12]} />
          <meshStandardMaterial color="#222226" roughness={0.92} />
        </mesh>
        {/* Grips */}
        {([-0.385, 0.385] as number[]).map((x, i) => (
          <mesh key={i} position={[x, 0.136, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.092, 14]} />
            <meshStandardMaterial color="#111111" roughness={0.94} />
          </mesh>
        ))}
        {/* Brake levers */}
        <Tube start={[-0.34, 0.136, 0]} end={[-0.40, 0.096, 0.065]} radius={0.008} color="#888" roughness={0.3} metalness={0.8} clearcoat={0} />
        <Tube start={[0.34, 0.136, 0]}  end={[0.40, 0.096, 0.065]}  radius={0.008} color="#888" roughness={0.3} metalness={0.8} clearcoat={0} />
      </group>

    </group>
  );
}

'use client';

import React from 'react';
import { useConfiguratorStore } from '@/lib/configuratorStore';

export default function BikeModel() {
  const {
    frameColor,
    chiBattery,
    ebmxController,
    motorCover,
    fox40,
    shvftworkBars
  } = useConfiguratorStore();

  return (
    <group position={[0, -0.4, 0]}>
      {/* ---------------- PLINTH / DISPLAY PAD ---------------- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.09, 0]} receiveShadow>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.7} />
      </mesh>
      
      {/* Plinth Border Outline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.088, 0]}>
        <ringGeometry args={[1.5, 1.52, 4]} />
        <meshBasicMaterial color="#333338" />
      </mesh>

      {/* ---------------- PADDOCK STAND ---------------- */}
      <group position={[0, 0.05, 0]}>
        {/* Left upright */}
        <mesh position={[-0.2, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.4]} />
          <meshStandardMaterial color="#0c0c0d" roughness={0.6} />
        </mesh>
        {/* Right upright */}
        <mesh position={[0.2, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.4]} />
          <meshStandardMaterial color="#0c0c0d" roughness={0.6} />
        </mesh>
        {/* Base tubes */}
        <mesh position={[0, -0.04, -0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.42]} />
          <meshStandardMaterial color="#0c0c0d" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.04, 0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.42]} />
          <meshStandardMaterial color="#0c0c0d" roughness={0.6} />
        </mesh>
        <mesh position={[-0.2, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.4]} />
          <meshStandardMaterial color="#0c0c0d" roughness={0.6} />
        </mesh>
        <mesh position={[0.2, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.4]} />
          <meshStandardMaterial color="#0c0c0d" roughness={0.6} />
        </mesh>
      </group>

      {/* ---------------- BIKE CORE ---------------- */}
      <group position={[0, 0.4, 0]}>
        
        {/* ----- Main Frame Spars (Colorable) ----- */}
        <group>
          {/* Main Frame diagonal left */}
          <mesh position={[-0.06, 0.2, 0.1]} rotation={[0.4, 0, -0.1]} castShadow>
            <boxGeometry args={[0.04, 0.12, 0.6]} />
            <meshPhysicalMaterial 
              color={frameColor.hex}
              roughness={0.15}
              metalness={0.2}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>
          {/* Main Frame diagonal right */}
          <mesh position={[0.06, 0.2, 0.1]} rotation={[-0.4, 0, -0.1]} castShadow>
            <boxGeometry args={[0.04, 0.12, 0.6]} />
            <meshPhysicalMaterial 
              color={frameColor.hex}
              roughness={0.15}
              metalness={0.2}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>
          {/* Bottom bracket motor cradle */}
          <mesh position={[0, -0.08, 0]} castShadow>
            <boxGeometry args={[0.15, 0.15, 0.2]} />
            <meshPhysicalMaterial 
              color={frameColor.hex}
              roughness={0.15}
              metalness={0.2}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>
          {/* Headtube */}
          <mesh position={[0, 0.45, 0.45]} rotation={[0.4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.22]} />
            <meshPhysicalMaterial 
              color={frameColor.hex}
              roughness={0.15}
              metalness={0.2}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>
        </group>

        {/* ----- Swingarm ----- */}
        <group position={[0, -0.05, -0.1]}>
          {/* Left swingarm beam */}
          <mesh position={[-0.07, 0.02, -0.38]} rotation={[-0.05, 0.08, 0]} castShadow>
            <boxGeometry args={[0.025, 0.06, 0.65]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>
          {/* Right swingarm beam */}
          <mesh position={[0.07, 0.02, -0.38]} rotation={[-0.05, -0.08, 0]} castShadow>
            <boxGeometry args={[0.025, 0.06, 0.65]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>
          {/* Swingarm pivot hinge joint */}
          <mesh position={[0, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.18]} />
            <meshStandardMaterial color="#2d2d2d" roughness={0.4} />
          </mesh>
        </group>

        {/* ----- Subframe & Seat ----- */}
        <group>
          {/* Subframe support beams */}
          <mesh position={[0, 0.25, -0.22]} rotation={[-0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.08, 0.03, 0.45]} />
            <meshStandardMaterial color="#1f1f21" roughness={0.6} />
          </mesh>
          {/* Seat */}
          <mesh position={[0, 0.36, -0.28]} rotation={[-0.1, 0, 0]} castShadow>
            <boxGeometry args={[0.13, 0.05, 0.46]} />
            <meshStandardMaterial color="#121213" roughness={0.8} />
          </mesh>
        </group>

        {/* ----- Battery Slot ----- */}
        <group position={[0, 0.18, 0.08]} rotation={[0.45, 0, 0]}>
          {chiBattery ? (
            /* Upgraded Chi Battery - Crimson design */
            <group>
              <mesh castShadow>
                <boxGeometry args={[0.13, 0.36, 0.22]} />
                <meshPhysicalMaterial color="#a00000" roughness={0.2} metalness={0.8} clearcoat={0.8} />
              </mesh>
              <mesh position={[0, 0, 0.115]} castShadow>
                <boxGeometry args={[0.1, 0.32, 0.01]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.9} />
              </mesh>
              <mesh position={[0, 0.05, 0.121]}>
                <boxGeometry args={[0.06, 0.03, 0.005]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ) : (
            /* Stock Sur-ron Battery - Carbon Black */
            <mesh castShadow>
              <boxGeometry args={[0.12, 0.32, 0.2]} />
              <meshStandardMaterial color="#282828" roughness={0.4} metalness={0.3} />
            </mesh>
          )}
        </group>

        {/* ----- Controller ----- */}
        <group position={[0, 0.25, 0.25]} rotation={[0.45, 0, 0]}>
          {ebmxController ? (
            /* CNC Purple anodized controller */
            <group>
              <mesh castShadow>
                <boxGeometry args={[0.11, 0.16, 0.09]} />
                <meshPhysicalMaterial color="#7209b7" roughness={0.15} metalness={0.9} clearcoat={0.5} />
              </mesh>
              <mesh position={[-0.04, 0, 0.05]} castShadow>
                <boxGeometry args={[0.01, 0.14, 0.02]} />
                <meshPhysicalMaterial color="#7209b7" roughness={0.15} metalness={0.9} clearcoat={0.5} />
              </mesh>
              <mesh position={[0, 0, 0.05]} castShadow>
                <boxGeometry args={[0.01, 0.14, 0.02]} />
                <meshPhysicalMaterial color="#7209b7" roughness={0.15} metalness={0.9} clearcoat={0.5} />
              </mesh>
              <mesh position={[0.04, 0, 0.05]} castShadow>
                <boxGeometry args={[0.01, 0.14, 0.02]} />
                <meshPhysicalMaterial color="#7209b7" roughness={0.15} metalness={0.9} clearcoat={0.5} />
              </mesh>
            </group>
          ) : (
            /* Stock black controller box */
            <mesh castShadow>
              <boxGeometry args={[0.1, 0.14, 0.07]} />
              <meshStandardMaterial color="#0e0e10" roughness={0.6} />
            </mesh>
          )}
        </group>

        {/* ----- Motor & Cover ----- */}
        <group position={[0, -0.1, -0.02]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.15]} />
            <meshStandardMaterial color="#2d3130" roughness={0.4} metalness={0.7} />
          </mesh>
          {motorCover && (
            <mesh position={[0, -0.04, 0.03]} rotation={[-0.3, 0, 0]} castShadow>
              <boxGeometry args={[0.14, 0.02, 0.22]} />
              <meshStandardMaterial color="#dddddd" roughness={0.1} metalness={0.9} />
            </mesh>
          )}
        </group>

        {/* ----- Suspension Spring ----- */}
        <group position={[0, 0.08, -0.13]} rotation={[0.5, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.18]} />
            <meshStandardMaterial color="#dddddd" roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <torusGeometry args={[0.025, 0.008, 8, 16]} />
            <meshStandardMaterial color="#a00000" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.03, 0]} castShadow>
            <torusGeometry args={[0.025, 0.008, 8, 16]} />
            <meshStandardMaterial color="#a00000" roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.03, 0]} castShadow>
            <torusGeometry args={[0.025, 0.008, 8, 16]} />
            <meshStandardMaterial color="#a00000" roughness={0.3} />
          </mesh>
        </group>

        {/* ----- Front Fork Assembly ----- */}
        <group position={[0, 0.2, 0.38]} rotation={[-0.4, 0, 0]}>
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[0.18, 0.02, 0.08]} />
            <meshStandardMaterial color="#080808" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.18, 0.02, 0.08]} />
            <meshStandardMaterial color="#080808" roughness={0.4} />
          </mesh>

          {/* Left fork leg */}
          <mesh position={[-0.075, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.62]} />
            {fox40 ? (
              <meshStandardMaterial color="#ff6b35" roughness={0.3} metalness={0.2} />
            ) : (
              <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.8} />
            )}
          </mesh>
          {/* Right fork leg */}
          <mesh position={[0.075, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.62]} />
            {fox40 ? (
              <meshStandardMaterial color="#ff6b35" roughness={0.3} metalness={0.2} />
            ) : (
              <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.8} />
            )}
          </mesh>

          {/* Kashima Stanchions */}
          <mesh position={[-0.075, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.36]} />
            {fox40 ? (
              <meshPhysicalMaterial color="#e7a93a" roughness={0.1} metalness={0.9} clearcoat={0.8} />
            ) : (
              <meshStandardMaterial color="#dddddd" roughness={0.1} metalness={0.9} />
            )}
          </mesh>
          <mesh position={[0.075, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.36]} />
            {fox40 ? (
              <meshPhysicalMaterial color="#e7a93a" roughness={0.1} metalness={0.9} clearcoat={0.8} />
            ) : (
              <meshStandardMaterial color="#dddddd" roughness={0.1} metalness={0.9} />
            )}
          </mesh>
          
          {/* Number Plate */}
          <mesh position={[0, 0.18, 0.05]} rotation={[0.05, 0, 0]} castShadow>
            <boxGeometry args={[0.14, 0.16, 0.01]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
        </group>

        {/* ----- Handlebars ----- */}
        <group position={[0, 0.52, 0.33]} rotation={[-0.05, 0, 0]}>
          <mesh position={[0, -0.02, 0]} castShadow>
            <boxGeometry args={[0.04, 0.06, 0.04]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.72]} />
            {shvftworkBars ? (
              <meshPhysicalMaterial color="#00b4d8" roughness={0.15} metalness={0.9} />
            ) : (
              <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.8} />
            )}
          </mesh>
          {/* Left Grip */}
          <mesh position={[-0.32, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.11]} />
            <meshStandardMaterial color="#0f0f10" roughness={0.9} />
          </mesh>
          {/* Right Grip */}
          <mesh position={[0.32, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.11]} />
            <meshStandardMaterial color="#0f0f10" roughness={0.9} />
          </mesh>
        </group>

        {/* ----- Front Wheel Assembly ----- */}
        <group position={[0, -0.32, 0.6]}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.33, 0.048, 12, 32]} />
            <meshStandardMaterial color="#151515" roughness={0.9} metalness={0.1} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.29, 0.015, 8, 32]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.8} />
          </mesh>
          {/* Front Hub */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.09]} />
            <meshStandardMaterial color="#dddddd" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Brake Rotor */}
          <mesh position={[0.035, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.005]} />
            <meshStandardMaterial color="#dddddd" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Axle Pin */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.16]} />
            <meshStandardMaterial color="#dddddd" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>

        {/* ----- Rear Wheel Assembly ----- */}
        <group position={[0, -0.32, -0.76]}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.33, 0.052, 12, 32]} />
            <meshStandardMaterial color="#151515" roughness={0.9} metalness={0.1} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.29, 0.015, 8, 32]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.8} />
          </mesh>
          {/* Rear Hub */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.038, 0.038, 0.11]} />
            <meshStandardMaterial color="#dddddd" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* sprocket */}
          <mesh position={[-0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.006]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.8} />
          </mesh>
          {/* Brake Rotor */}
          <mesh position={[0.035, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.005]} />
            <meshStandardMaterial color="#dddddd" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Axle Pin */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.18]} />
            <meshStandardMaterial color="#dddddd" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>

      </group>
    </group>
  );
}

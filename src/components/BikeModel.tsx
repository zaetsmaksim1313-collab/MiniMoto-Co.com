'use client';

import React, { useRef } from 'react';
import { useConfiguratorStore } from '@/lib/configuratorStore';
import * as THREE from 'three';

export default function BikeModel() {
  const {
    frameColor,
    chiBattery,
    ebmxController,
    motorCover,
    fox40,
    shvftworkBars
  } = useConfiguratorStore();

  // Materials
  const frameMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(frameColor.hex),
    roughness: 0.15,
    metalness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });

  const blackMetalMat = new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    roughness: 0.5,
    metalness: 0.8,
  });

  const tireMaterial = new THREE.MeshStandardMaterial({
    color: '#151515',
    roughness: 0.9,
    metalness: 0.1,
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: '#dddddd',
    roughness: 0.1,
    metalness: 0.9,
  });

  const carbonFiberMaterial = new THREE.MeshStandardMaterial({
    color: '#282828',
    roughness: 0.4,
    metalness: 0.3,
  });

  // Upgrade Materials
  const chiBatteryMaterial = new THREE.MeshPhysicalMaterial({
    color: '#a00000', // Crimson battery accent
    roughness: 0.2,
    metalness: 0.8,
    clearcoat: 0.8,
  });

  const ebmxControllerMaterial = new THREE.MeshPhysicalMaterial({
    color: '#7209b7', // CNC purple anodized
    roughness: 0.15,
    metalness: 0.9,
    clearcoat: 0.5,
  });

  const kashimaForkMaterial = new THREE.MeshPhysicalMaterial({
    color: '#e7a93a', // Fox 40 Kashima Gold
    roughness: 0.1,
    metalness: 0.9,
    clearcoat: 0.8,
  });

  const foxOrangeMaterial = new THREE.MeshStandardMaterial({
    color: '#ff6b35', // Fox Racing Orange
    roughness: 0.3,
    metalness: 0.2,
  });

  const shvftworkBarsMaterial = new THREE.MeshPhysicalMaterial({
    color: '#00b4d8', // Anodized Blue
    roughness: 0.15,
    metalness: 0.9,
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* ---------------- PLINTH / DISPLAY PAD ---------------- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.09, 0]} receiveShadow>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.7} />
      </mesh>
      
      {/* Plinth Border Outline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.088, 0]}>
        <ringGeometry args={[1.5, 1.52, 4]} /> {/* Stylized display border */}
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
            <primitive object={frameMaterial} attach="material" />
          </mesh>
          {/* Main Frame diagonal right */}
          <mesh position={[0.06, 0.2, 0.1]} rotation={[-0.4, 0, -0.1]} castShadow>
            <boxGeometry args={[0.04, 0.12, 0.6]} />
            <primitive object={frameMaterial} attach="material" />
          </mesh>
          {/* Bottom bracket motor cradle */}
          <mesh position={[0, -0.08, 0]} castShadow>
            <boxGeometry args={[0.15, 0.15, 0.2]} />
            <primitive object={frameMaterial} attach="material" />
          </mesh>
          {/* Headtube */}
          <mesh position={[0, 0.45, 0.45]} rotation={[0.4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.22]} />
            <primitive object={frameMaterial} attach="material" />
          </mesh>
        </group>

        {/* ----- Swingarm (Rear suspension arm, black or matching frame) ----- */}
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
            /* Upgraded Chi Battery - Larger, with glowing red/crimson power cells styling */
            <group>
              <mesh castShadow>
                <boxGeometry args={[0.13, 0.36, 0.22]} />
                <primitive object={chiBatteryMaterial} attach="material" />
              </mesh>
              <mesh position={[0, 0, 0.115]} castShadow>
                <boxGeometry args={[0.1, 0.32, 0.01]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.9} />
              </mesh>
              {/* Battery text logo badge */}
              <mesh position={[0, 0.05, 0.121]} rotation={[0, 0, 0]}>
                <boxGeometry args={[0.06, 0.03, 0.005]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ) : (
            /* Stock Sur-ron Battery - Standard Carbon Black/Dark grey cover */
            <mesh castShadow>
              <boxGeometry args={[0.12, 0.32, 0.2]} />
              <primitive object={carbonFiberMaterial} attach="material" />
            </mesh>
          )}
        </group>

        {/* ----- Controller (Front-mounted) ----- */}
        <group position={[0, 0.25, 0.25]} rotation={[0.45, 0, 0]}>
          {ebmxController ? (
            /* CNC Purple anodized controller with cooling heatsink fins */
            <group>
              {/* Main Controller Body */}
              <mesh castShadow>
                <boxGeometry args={[0.11, 0.16, 0.09]} />
                <primitive object={ebmxControllerMaterial} attach="material" />
              </mesh>
              {/* Fin 1 */}
              <mesh position={[-0.04, 0, 0.05]} castShadow>
                <boxGeometry args={[0.01, 0.14, 0.02]} />
                <primitive object={ebmxControllerMaterial} attach="material" />
              </mesh>
              {/* Fin 2 */}
              <mesh position={[0, 0, 0.05]} castShadow>
                <boxGeometry args={[0.01, 0.14, 0.02]} />
                <primitive object={ebmxControllerMaterial} attach="material" />
              </mesh>
              {/* Fin 3 */}
              <mesh position={[0.04, 0, 0.05]} castShadow>
                <boxGeometry args={[0.01, 0.14, 0.02]} />
                <primitive object={ebmxControllerMaterial} attach="material" />
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
          {/* Main circular motor housing */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.15]} />
            <meshStandardMaterial color="#2d3130" roughness={0.4} metalness={0.7} />
          </mesh>
          {/* Motor Skid Plate / Guard */}
          {motorCover && (
            <mesh position={[0, -0.04, 0.03]} rotation={[-0.3, 0, 0]} castShadow>
              <boxGeometry args={[0.14, 0.02, 0.22]} />
              <primitive object={chromeMaterial} attach="material" />
            </mesh>
          )}
        </group>

        {/* ----- Suspension Spring (Rear shock) ----- */}
        <group position={[0, 0.08, -0.13]} rotation={[0.5, 0, 0]}>
          {/* Shock damper cylinder */}
          <mesh castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.18]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
          {/* Spring Coil rings */}
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
          {/* Upper Triple Clamp */}
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[0.18, 0.02, 0.08]} />
            <meshStandardMaterial color="#080808" roughness={0.4} />
          </mesh>
          {/* Lower Triple Clamp */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.18, 0.02, 0.08]} />
            <meshStandardMaterial color="#080808" roughness={0.4} />
          </mesh>

          {/* Left fork leg */}
          <mesh position={[-0.075, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.62]} />
            <primitive object={fox40 ? foxOrangeMaterial : blackMetalMat} attach="material" />
          </mesh>
          {/* Right fork leg */}
          <mesh position={[0.075, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.62]} />
            <primitive object={fox40 ? foxOrangeMaterial : blackMetalMat} attach="material" />
          </mesh>

          {/* Kashima Stanchions (Inner fork tubes) sliding down */}
          <mesh position={[-0.075, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.36]} />
            <primitive object={fox40 ? kashimaForkMaterial : chromeMaterial} attach="material" />
          </mesh>
          <mesh position={[0.075, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.36]} />
            <primitive object={fox40 ? kashimaForkMaterial : chromeMaterial} attach="material" />
          </mesh>
          
          {/* Number Plate / Front Shield */}
          <mesh position={[0, 0.18, 0.05]} rotation={[0.05, 0, 0]} castShadow>
            <boxGeometry args={[0.14, 0.16, 0.01]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
        </group>

        {/* ----- Handlebars ----- */}
        <group position={[0, 0.52, 0.33]} rotation={[-0.05, 0, 0]}>
          {/* Riser Stem */}
          <mesh position={[0, -0.02, 0]} castShadow>
            <boxGeometry args={[0.04, 0.06, 0.04]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
          </mesh>
          {/* Main Handlebar Tube */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.72]} />
            <primitive object={shvftworkBars ? shvftworkBarsMaterial : blackMetalMat} attach="material" />
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
            <primitive object={tireMaterial} attach="material" />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.29, 0.015, 8, 32]} />
            <primitive object={blackMetalMat} attach="material" />
          </mesh>
          {/* Front Hub */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.09]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
          {/* Brake Rotor */}
          <mesh position={[0.035, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.005]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
          {/* Axle Pin */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.16]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
        </group>

        {/* ----- Rear Wheel Assembly ----- */}
        <group position={[0, -0.32, -0.76]}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.33, 0.052, 12, 32]} />
            <primitive object={tireMaterial} attach="material" />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.29, 0.015, 8, 32]} />
            <primitive object={blackMetalMat} attach="material" />
          </mesh>
          {/* Rear Hub */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.038, 0.038, 0.11]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
          {/* Large rear drive sprocket */}
          <mesh position={[-0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.006]} />
            <primitive object={blackMetalMat} attach="material" />
          </mesh>
          {/* Brake Rotor */}
          <mesh position={[0.035, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.005]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
          {/* Axle Pin */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.18]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
        </group>

      </group>
    </group>
  );
}

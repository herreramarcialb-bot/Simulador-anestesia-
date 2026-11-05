import React from "react";
import * as THREE from "three";
// Original illustrative instrument, not an anatomical mesh or a calibrated device.
// Longitudinal axis: +Y toward the needle. Total length approximately 170 mm
// relative to the source atlas (1 viewer unit = 31.25 mm).
export function DentalSyringe({ syringe, selected, onSelect }) {
  const metal = {
    color: selected ? "#d5ddd9" : "#b7c3c5",
    metalness: 0.8,
    roughness: 0.23,
  };
  const ring = (y, r, t = 0.025) => (
    <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[r, t, 12, 48]} />
      <meshStandardMaterial {...metal} />
    </mesh>
  );
  return (
    <group
      position={[syringe.x, syringe.y, syringe.z]}
      rotation={[
        THREE.MathUtils.degToRad(syringe.pitch),
        THREE.MathUtils.degToRad(syringe.yaw),
        Math.PI / 2,
      ]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Visible glass cartridge between the two metal barrel rails. */}
      <mesh>
        <cylinderGeometry args={[0.095, 0.095, 1.75, 32]} />
        <meshPhysicalMaterial
          color="#b3d8db"
          transparent
          opacity={0.45}
          metalness={0.05}
          roughness={0.12}
          depthWrite={false}
        />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.11, 0, 0]}>
          <boxGeometry args={[0.035, 1.82, 0.075]} />
          <meshStandardMaterial {...metal} />
        </mesh>
      ))}
      {[-0.9, 0.9].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.14, 32]} />
          <meshStandardMaterial {...metal} />
        </mesh>
      ))}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.084, 0.084, 0.12, 32]} />
        <meshStandardMaterial color="#6d8990" roughness={0.65} />
      </mesh>
      <mesh position={[0, 1.09, 0]}>
        <cylinderGeometry args={[0.055, 0.12, 0.28, 32]} />
        <meshStandardMaterial color="#bc9456" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Slender 27G-like needle; illustrative dimensions, not a clinical recommendation. */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.96, 12]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <coneGeometry args={[0.007, 0.06, 8]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0, -1.25, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.68, 20]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      {ring(-1.94, 0.23, 0.032)}
      <mesh position={[0, -1.65, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.15, 24]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[s * 0.28, -0.91, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[1.25, 0.8, 1]}
        >
          <torusGeometry args={[0.17, 0.027, 12, 48]} />
          <meshStandardMaterial {...metal} />
        </mesh>
      ))}
      {[-0.68, -0.56, -0.44, -0.32, -0.2, -0.08, 0.04, 0.16, 0.28, 0.4].map(
        (y) => (
          <mesh key={y} position={[0, y, 0.098]}>
            <boxGeometry args={[0.055, 0.007, 0.003]} />
            <meshStandardMaterial color="#698288" roughness={0.6} />
          </mesh>
        ),
      )}
    </group>
  );
}

import React, { useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Grid } from "@react-three/drei";

function Tube({ points, radius = 0.08, color, opacity = 1, onClick }) {
  const geometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
        64,
        radius,
        12,
        false,
      ),
    [JSON.stringify(points), radius],
  );
  return (
    <mesh geometry={geometry} onClick={onClick}>
      <meshStandardMaterial
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
        roughness={0.45}
        depthWrite={opacity === 1}
      />
    </mesh>
  );
}
const arch = (y, width = 1) =>
  Array.from({ length: 41 }, (_, i) => {
    const a = (Math.PI * i) / 40;
    return [Math.cos(a) * 2.05 * width, y, Math.sin(a) * 2.3 - 0.8];
  });
const nerves = (side) => [
  [side * 2.04, 1.15, -0.94],
  [side * 1.89, 0.5, -0.68],
  [side * 1.83, -0.23, -0.45],
  [side * 1.6, -0.5, 0.55],
  [side * 0.95, -0.52, 1.25],
  [side * 0.45, -0.42, 1.43],
];
export function Scene({
  visible,
  boneOpacity,
  selected,
  onSelect,
  syringe,
  viewKey,
  view,
}) {
  const select = (key) => (e) => {
    e.stopPropagation();
    onSelect(key);
  };
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [7, 5.2, 9], fov: 39 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      onPointerMissed={() => onSelect(null)}
      onCreated={({ gl }) => {
        gl.setClearColor("#edf2ef");
        gl.domElement.dataset.ready = "true";
      }}
    >
      <ambientLight intensity={1.3} />
      <directionalLight position={[4, 8, 6]} intensity={2.5} castShadow />
      <directionalLight
        position={[-5, 3, -3]}
        intensity={1.5}
        color="#b3ded7"
      />
      <group position={[0, 0.05, 0]}>
        {visible.mandible && (
          <group onClick={select("mandible")}>
            <Tube
              points={arch(-0.63)}
              radius={0.29}
              color={selected === "mandible" ? "#efc893" : "#dfd3bd"}
              opacity={boneOpacity}
            />
            <Tube
              points={arch(-0.22)}
              radius={0.21}
              color="#e9deca"
              opacity={boneOpacity}
            />
            {[-1, 1].map((s) => (
              <group key={s}>
                <Tube
                  points={[
                    [s * 2.05, -0.5, -0.8],
                    [s * 2.12, 0.15, -1],
                    [s * 2.1, 0.85, -1.15],
                    [s * 1.98, 1.48, -1.23],
                  ]}
                  radius={0.27}
                  color="#dfd3bd"
                  opacity={boneOpacity}
                />
                <mesh
                  position={[s * 1.98, 1.53, -1.23]}
                  scale={[0.34, 0.21, 0.23]}
                >
                  <sphereGeometry args={[1, 24, 16]} />
                  <meshStandardMaterial
                    color="#e4d7c1"
                    transparent
                    opacity={boneOpacity}
                  />
                </mesh>
                <Tube
                  points={[
                    [s * 2.1, 0.45, -0.93],
                    [s * 1.87, 1.23, -0.5],
                  ]}
                  radius={0.17}
                  color="#e5d9c4"
                  opacity={boneOpacity}
                />
              </group>
            ))}
          </group>
        )}
        {visible.maxilla && (
          <group onClick={select("maxilla")}>
            <Tube
              points={arch(1.48, 0.98)}
              radius={0.29}
              color={selected === "maxilla" ? "#efc893" : "#e5d9c4"}
              opacity={boneOpacity}
            />
            <Tube
              points={arch(1.81, 0.96)}
              radius={0.2}
              color="#e7ddcd"
              opacity={boneOpacity}
            />
            {[-1, 1].map((s) => (
              <Tube
                key={s}
                points={[
                  [s * 1.9, 1.7, -0.6],
                  [s * 2.3, 2, -0.6],
                  [s * 2.6, 1.95, -1],
                ]}
                radius={0.16}
                color="#dfd3bd"
                opacity={boneOpacity}
              />
            ))}
          </group>
        )}
        {visible.teeth && (
          <group onClick={select("teeth")}>
            {[false, true].flatMap((upper) =>
              Array.from({ length: 14 }, (_, i) => {
                const a = 0.12 + ((Math.PI - 0.24) * i) / 13;
                const back = Math.abs(Math.cos(a));
                return (
                  <group
                    key={`${upper}-${i}`}
                    position={[
                      Math.cos(a) * 2 * (upper ? 0.98 : 1),
                      upper ? 1.05 : 0.18,
                      Math.sin(a) * 2.3 - 0.8,
                    ]}
                    rotation={[0, -a, 0]}
                  >
                    <mesh
                      castShadow
                      scale={[
                        back > 0.65 ? 0.35 : 0.27,
                        0.36,
                        back > 0.65 ? 0.4 : 0.27,
                      ]}
                    >
                      <boxGeometry args={[1, 1.5, 1]} />
                      <meshStandardMaterial
                        color={selected === "teeth" ? "#fff0cf" : "#fffdf0"}
                        roughness={0.24}
                      />
                    </mesh>
                    <mesh
                      position={[0, upper ? 0.32 : -0.32, 0]}
                      rotation={[upper ? 0 : Math.PI, 0, 0]}
                      scale={[0.14, 0.24, 0.13]}
                    >
                      <coneGeometry args={[1, 2, 12]} />
                      <meshStandardMaterial color="#e5d8bd" />
                    </mesh>
                  </group>
                );
              }),
            )}
          </group>
        )}
        {visible.nerve &&
          [-1, 1].map((side) => (
            <group key={side}>
              <Tube
                points={nerves(side)}
                radius={selected === "nerve" ? 0.092 : 0.065}
                color={selected === "nerve" ? "#ffca54" : "#e9a836"}
                onClick={select("nerve")}
              />
              <Tube
                points={[
                  [side * 0.95, -0.52, 1.25],
                  [side * 1.18, -0.25, 1.64],
                  [side * 1.38, -0.1, 1.7],
                ]}
                radius={0.044}
                color="#e9a836"
                onClick={select("nerve")}
              />
              {[0.6, 1.1, 1.5].map((x, i) => (
                <Tube
                  key={x}
                  points={[
                    [side * x, -0.48, 1.4 - i * 0.25],
                    [side * x, -0.1, 1.4 - i * 0.25],
                  ]}
                  radius={0.022}
                  color="#efb749"
                  onClick={select("nerve")}
                />
              ))}
            </group>
          ))}
        {visible.syringe && (
          <group
            position={[syringe.x, syringe.y, syringe.z]}
            rotation={[
              THREE.MathUtils.degToRad(syringe.pitch),
              THREE.MathUtils.degToRad(syringe.yaw),
              Math.PI / 2,
            ]}
            onClick={select("syringe")}
          >
            <mesh castShadow>
              <cylinderGeometry args={[0.115, 0.115, 1.25, 24]} />
              <meshStandardMaterial
                color="#bacbce"
                metalness={0.85}
                roughness={0.22}
              />
            </mesh>
            <mesh position={[0.03, 0, 0.098]}>
              <boxGeometry args={[0.07, 0.83, 0.035]} />
              <meshStandardMaterial
                color="#9ed5d7"
                metalness={0.1}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 0.94, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.63, 12]} />
              <meshStandardMaterial
                color="#a8b9bd"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 1.54, 0]}>
              <cylinderGeometry args={[0.009, 0.012, 0.58, 10]} />
              <meshStandardMaterial
                color="#96a9b0"
                metalness={1}
                roughness={0.15}
              />
            </mesh>
            <mesh position={[0, -0.91, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.6, 12]} />
              <meshStandardMaterial
                color="#c2cfd1"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, -1.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.19, 0.035, 10, 30]} />
              <meshStandardMaterial
                color="#aabcc0"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh
                key={s}
                position={[s * 0.22, -0.48, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <torusGeometry args={[0.16, 0.026, 10, 24]} />
                <meshStandardMaterial
                  color="#aabcc0"
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            ))}
          </group>
        )}
      </group>
      <ContactShadows
        position={[0, -1.3, 0]}
        opacity={0.25}
        scale={15}
        blur={2.8}
        far={7}
      />
      <Grid
        position={[0, -1.32, 0]}
        args={[20, 20]}
        cellSize={0.6}
        cellThickness={0.5}
        cellColor="#bdcfca"
        sectionColor="#bdcfca"
        sectionThickness={0.5}
        fadeDistance={14}
        infiniteGrid
      />
      <OrbitControls
        key={`${viewKey}-${view}`}
        makeDefault
        target={[0, 0.6, 0]}
        minDistance={5}
        maxDistance={18}
        enableDamping
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI * 0.88}
      />
      <CameraView key={`camera-${viewKey}-${view}`} view={view} />
    </Canvas>
  );
}
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
function CameraView({ view }) {
  const { camera, controls, size } = useThree();
  useEffect(() => {
    camera.position.set(
      ...(view === "frontal"
        ? [0, 3, 11]
        : view === "lateral"
          ? [10, 3, 0]
          : [7, 5.2, 9]),
    );
    // Preserve the full model when the viewport is narrow.
    const fit = Math.max(1, 0.95 / (size.width / size.height));
    camera.position
      .sub(new THREE.Vector3(0, 0.6, 0))
      .multiplyScalar(fit)
      .add(new THREE.Vector3(0, 0.6, 0));
    camera.lookAt(0, 0.6, 0);
    controls?.update();
  }, [view, camera, controls, size.width, size.height]);
  return null;
}

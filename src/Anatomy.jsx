import React, { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { DentalSyringe } from "./DentalSyringe";
import { NeuroLayer } from "./NeuroLayer";
import { FMA_TO_FDI, territoryTeeth, TERRITORY_COLORS } from "./neuroData";

const MODEL_URL = `${import.meta.env.BASE_URL}models/bodyparts3d/craniofacial.glb`;
// One common rigid transform for all source structures; native anatomical
// relationships are preserved. BodyParts3D millimetres → viewer units.
const SCALE = 0.032;
const CENTER = [0, 1536.94, 96.4];

function AnatomyModel({ visible, boneOpacity, selected, onSelect, neuro }) {
  const { scene } = useGLTF(MODEL_URL);
  const { gl } = useThree();
  const parts = useMemo(() => {
    const result = [];
    scene.traverse((node) => {
      if (node.isMesh)
        result.push({
          name: node.name,
          geometry: node.geometry,
          key: node.userData.anatomyKey,
          fma: node.userData.fma,
        });
    });
    return result;
  }, [scene]);
  useEffect(() => {
    gl.domElement.dataset.modelLoaded = "true";
    gl.domElement.dataset.meshCount = String(parts.length);
    return () => {
      delete gl.domElement.dataset.modelLoaded;
      delete gl.domElement.dataset.meshCount;
    };
  }, [gl, parts]);
  const territory = territoryTeeth(neuro.technique, neuro.side);
  return (
    <group scale={SCALE} position={CENTER.map((v) => -v * SCALE)}>
      {parts.map((part) => {
        const tooth = part.key === "teeth";
        const active = selected === part.key;
        const fdi = FMA_TO_FDI[part.fma];
        const tint =
          tooth && neuro.enabled && neuro.showTerritory && neuro.showPulp
            ? territory.pulp.includes(fdi)
              ? TERRITORY_COLORS.pulp
              : territory.partial.includes(fdi)
                ? TERRITORY_COLORS.partial
                : null
            : null;
        return (
          <mesh
            key={part.name}
            name={part.name}
            geometry={part.geometry}
            raycast={
              neuro.enabled && neuro.xray
                ? () => null
                : THREE.Mesh.prototype.raycast
            }
            visible={visible[part.key]}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(part.key);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              gl.domElement.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              gl.domElement.style.cursor = "grab";
            }}
          >
            <meshStandardMaterial
              color={
                tint || (tooth ? "#f5eee0" : active ? "#dfcda8" : "#d8cbb4")
              }
              roughness={tooth ? 0.32 : 0.72}
              metalness={0}
              transparent={!tooth && boneOpacity < 1}
              opacity={tooth ? 1 : boneOpacity}
              depthWrite={tooth || boneOpacity === 1}
              side={THREE.DoubleSide}
              emissive={tint || (active ? "#3b2b12" : "#000000")}
              emissiveIntensity={tint ? 0.25 : active ? 0.1 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}
export function ModelLoadingStatus() {
  const { active, progress } = useProgress();
  return active ? (
    <div className="model-loading" role="status">
      Cargando atlas anatómico… <b>{Math.round(progress)}%</b>
    </div>
  ) : null;
}
export function Scene({
  visible,
  boneOpacity,
  selected,
  onSelect,
  syringe,
  viewKey,
  view,
  neuro,
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [8, 3.8, 12], fov: 39, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        preserveDrawingBuffer: true,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      onPointerMissed={() => onSelect(null)}
      onCreated={({ gl }) => {
        gl.setClearColor("#edf2ef");
        gl.domElement.dataset.ready = "true";
      }}
    >
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#fffaf0", "#b2bab4", 0.8]} />
      <directionalLight position={[5, 7, 8]} intensity={2.2} color="#fff5e6" />
      <directionalLight position={[-6, 2, 4]} intensity={0.6} color="#e1edf3" />
      <directionalLight position={[2, 5, -6]} intensity={1.2} color="#ffffff" />
      <Suspense fallback={null}>
        <AnatomyModel
          visible={visible}
          boneOpacity={boneOpacity}
          selected={selected}
          onSelect={onSelect}
          neuro={neuro}
        />
      </Suspense>
      {neuro.enabled && (
        <NeuroLayer
          {...neuro}
          selected={selected}
          onPick={(id) => onSelect(`neuro-${id}`)}
        />
      )}
      {visible.syringe && (
        <DentalSyringe
          syringe={syringe}
          selected={selected === "syringe"}
          onSelect={() => onSelect("syringe")}
        />
      )}
      <ContactShadows
        position={[0, -3.35, 0]}
        opacity={0.2}
        scale={18}
        blur={2.6}
        far={10}
        frames={1}
      />
      <OrbitControls
        key={`${viewKey}-${view}`}
        makeDefault
        target={neuro.enabled ? [0, -1.3, 1.8] : [0, 0, 0]}
        minDistance={5}
        maxDistance={26}
        enableDamping
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI * 0.92}
      />
      <CameraView
        key={`camera-${viewKey}-${view}`}
        view={view}
        neuroEnabled={neuro.enabled}
      />
    </Canvas>
  );
}
function CameraView({ view, neuroEnabled }) {
  const { camera, controls, size } = useThree();
  useEffect(() => {
    const position =
      view === "frontal"
        ? [0, 1, 14]
        : view === "lateral"
          ? [14, 1, 0]
          : [8, 3.8, 12];
    const target = new THREE.Vector3(
      ...(neuroEnabled ? [0, -1.3, 1.8] : [0, 0, 0]),
    );
    const direction = neuroEnabled
      ? view === "frontal"
        ? [0, 0.6, 10]
        : view === "lateral"
          ? [10, 0.6, 0]
          : [7, 2.8, 10]
      : position;
    const fit = Math.max(1, 0.95 / (size.width / size.height));
    camera.position
      .set(...direction)
      .multiplyScalar(fit)
      .add(target);
    camera.lookAt(target);
    controls?.update();
  }, [view, camera, controls, size.width, size.height, neuroEnabled]);
  return null;
}

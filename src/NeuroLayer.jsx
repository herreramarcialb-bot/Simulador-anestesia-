import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { NERVES, TECHNIQUES, TERRITORY_COLORS, sidePoint } from "./neuroData";
// Concept maps, not segmented mucosa/skin. Deliberately broad, approximate
// surfaces around dental reference regions; not injection or boundary geometry.
const PATCHES = {
  lowerLip: [
    [0, 1461, 191],
    [12, 1461, 189],
    [24, 1458, 182],
    [23, 1452, 184],
    [11, 1451, 192],
    [0, 1452, 194],
  ],
  chin: [
    [0, 1450, 191],
    [18, 1450, 184],
    [24, 1442, 180],
    [12, 1435, 184],
    [0, 1435, 188],
  ],
  lowerVestibular: [
    [0, 1457, 185],
    [11, 1458, 181],
    [25, 1460, 170],
    [27, 1454, 168],
    [13, 1451, 181],
    [0, 1451, 187],
  ],
  lingualGingiva: [
    [0, 1460, 174],
    [11, 1462, 168],
    [20, 1468, 150],
    [24, 1470, 139],
    [20, 1467, 137],
    [15, 1463, 151],
    [8, 1458, 166],
    [0, 1457, 170],
  ],
  tongue: [
    [0, 1465, 174],
    [10, 1464, 167],
    [17, 1463, 151],
    [13, 1465, 143],
    [0, 1466, 142],
  ],
  floor: [
    [0, 1459, 173],
    [10, 1459, 164],
    [18, 1460, 152],
    [13, 1459, 143],
    [0, 1458, 143],
  ],
  lowerMolarVestibular: [
    [27, 1463, 158],
    [35, 1470, 141],
    [39, 1466, 137],
    [33, 1456, 153],
  ],
  cheek: [
    [36, 1476, 143],
    [42, 1471, 146],
    [40, 1459, 155],
    [33, 1455, 160],
    [31, 1466, 153],
  ],
  upperMolarVestibular: [
    [28, 1483, 144],
    [32, 1482, 155],
    [30, 1476, 158],
    [28, 1477, 146],
  ],
  upperPremolarVestibular: [
    [28, 1482, 160],
    [25, 1480, 174],
    [28, 1474, 175],
    [32, 1476, 160],
  ],
  upperAnteriorVestibular: [
    [0, 1481, 188],
    [13, 1483, 185],
    [23, 1484, 177],
    [25, 1477, 180],
    [14, 1476, 190],
    [0, 1476, 193],
  ],
  upperLip: [
    [0, 1488, 197],
    [12, 1489, 195],
    [22, 1490, 188],
    [23, 1483, 189],
    [12, 1481, 197],
    [0, 1481, 199],
  ],
  nose: [
    [9, 1509, 195],
    [17, 1512, 190],
    [21, 1502, 191],
    [13, 1499, 197],
  ],
  eyelid: [
    [15, 1518, 184],
    [29, 1520, 176],
    [37, 1514, 169],
    [33, 1510, 179],
    [21, 1511, 189],
  ],
  posteriorPalate: [
    [0, 1479, 139],
    [17, 1479, 139],
    [21, 1479, 149],
    [16, 1479, 163],
    [10, 1479, 169],
    [0, 1479, 169],
  ],
  anteriorPalate: [
    [-13, 1478, 170],
    [-10, 1478, 178],
    [0, 1478, 183],
    [10, 1478, 178],
    [13, 1478, 170],
    [0, 1478, 168],
  ],
};
function NervePath({ points, color, selected, onPick, xray, name }) {
  const geometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(
          points.map((p) => new THREE.Vector3(...p)),
          false,
          "centripetal",
        ),
        48,
        selected ? 1.2 : 0.85,
        8,
        false,
      ),
    [points, selected],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh
      name={name}
      geometry={geometry}
      renderOrder={xray ? 10 : 1}
      onClick={(e) => {
        e.stopPropagation();
        onPick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={selected ? 0.4 : 0.12}
        roughness={0.5}
        depthTest={!xray}
      />
    </mesh>
  );
}
function SoftPatch({ id, side, xray }) {
  const geometry = useMemo(() => {
    const points = PATCHES[id].map((p) =>
      id === "anteriorPalate" ? p : sidePoint(p, side),
    );
    const middle = new THREE.Vector3();
    points.forEach((p) => middle.add(new THREE.Vector3(...p)));
    middle.divideScalar(points.length);
    const vertices = [];
    points.forEach((p, i) =>
      vertices.push(
        ...middle.toArray(),
        ...p,
        ...points[(i + 1) % points.length],
      ),
    );
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    g.computeVertexNormals();
    return g;
  }, [id, side]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh
      name={`soft-${id}`}
      geometry={geometry}
      renderOrder={xray ? 9 : 2}
      raycast={() => null}
    >
      <meshBasicMaterial
        color={TERRITORY_COLORS.soft}
        side={THREE.DoubleSide}
        transparent
        opacity={0.55}
        depthWrite={false}
        depthTest={!xray}
      />
    </mesh>
  );
}
export function NeuroLayer({
  visibleNerves,
  selected,
  onPick,
  side,
  xray,
  showTerritory,
  technique,
  showSoft,
}) {
  const curves = useMemo(
    () =>
      Object.entries(NERVES).flatMap(([id, n]) =>
        n.paths.map((path, i) => ({
          id,
          key: `${id}-${i}`,
          points: path.map((p) =>
            id === "nasopalatine" ? p : sidePoint(p, side),
          ),
          color: n.color,
        })),
      ),
    [side],
  );
  return (
    <group scale={0.032} position={[0, -1536.94 * 0.032, -96.4 * 0.032]}>
      {curves
        .filter((c) => visibleNerves[c.id])
        .map((c) => (
          <NervePath
            key={c.key}
            points={c.points}
            name={`nerve-${c.id}`}
            color={c.color}
            selected={selected === `neuro-${c.id}`}
            xray={xray}
            onPick={() => onPick(c.id)}
          />
        ))}
      {showTerritory &&
        showSoft &&
        TECHNIQUES[technique].soft.map((id) => (
          <SoftPatch key={id} id={id} side={side} xray={xray} />
        ))}
    </group>
  );
}

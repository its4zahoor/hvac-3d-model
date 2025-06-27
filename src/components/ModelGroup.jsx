// src/components/ModelGroup.jsx
import { useGLTF, Grid } from '@react-three/drei';
import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

const modelPaths = {
  DUCT: '/models/DUCT.glb',
  FAN1: '/models/FAN1.glb',
  FAN2: '/models/FAN2.glb',
  FILTER: '/models/FILTER.glb',
  HOT: '/models/HOT.glb',
  COOL: '/models/COOL.glb',
  HRW: '/models/HRW.glb',
  DAMPER1: '/models/DAMPER1.glb',
  DAMPER2: '/models/DAMPER2.glb',
  DAMPER3: '/models/DAMPER3.glb',
  DAMPER4: '/models/DAMPER4.glb',
  DAMPER5: '/models/DAMPER5.glb',
  'PRE-FILTER1': '/models/PRE-FILTER1.glb',
  'PRE-FILTER2': '/models/PRE-FILTER2.glb',
  SENSOR1: '/models/SENSOR1.glb',
  SENSOR2: '/models/SENSOR2.glb',
};

export default function ModelGroup({ visibility, onCenterChange }) {
  const groupRef = useRef();
  const lastCenter = useRef(new THREE.Vector3());

  // 1) Call every hook at top‐level, in a stable order
  const ductGLTF = useGLTF(modelPaths.DUCT);
  const fan1GLTF = useGLTF(modelPaths.FAN1);
  const fan2GLTF = useGLTF(modelPaths.FAN2);
  const filterGLTF = useGLTF(modelPaths.FILTER);
  const hotGLTF = useGLTF(modelPaths.HOT);
  const coolGLTF = useGLTF(modelPaths.COOL);
  const hrwGLTF = useGLTF(modelPaths.HRW);
  const damper1GLTF = useGLTF(modelPaths.DAMPER1);
  const damper2GLTF = useGLTF(modelPaths.DAMPER2);
  const damper3GLTF = useGLTF(modelPaths.DAMPER3);
  const damper4GLTF = useGLTF(modelPaths.DAMPER4);
  const damper5GLTF = useGLTF(modelPaths.DAMPER5);
  const preFilter1GLTF = useGLTF(modelPaths['PRE-FILTER1']);
  const preFilter2GLTF = useGLTF(modelPaths['PRE-FILTER2']);
  const sensor1GLTF = useGLTF(modelPaths.SENSOR1);
  const sensor2GLTF = useGLTF(modelPaths.SENSOR2);

  // 2) Bundle them in a memo’d map (so its identity is stable
  //    unless one of the GLTF objects actually changes)
  const gltfMap = useMemo(
    () => ({
      DUCT: ductGLTF,
      FAN1: fan1GLTF,
      FAN2: fan2GLTF,
      FILTER: filterGLTF,
      HOT: hotGLTF,
      COOL: coolGLTF,
      HRW: hrwGLTF,
      DAMPER1: damper1GLTF,
      DAMPER2: damper2GLTF,
      DAMPER3: damper3GLTF,
      DAMPER4: damper4GLTF,
      DAMPER5: damper5GLTF,
      'PRE-FILTER1': preFilter1GLTF,
      'PRE-FILTER2': preFilter2GLTF,
      SENSOR1: sensor1GLTF,
      SENSOR2: sensor2GLTF,
    }),
    [
      ductGLTF,
      fan1GLTF,
      fan2GLTF,
      filterGLTF,
      hotGLTF,
      coolGLTF,
      hrwGLTF,
      damper1GLTF,
      damper2GLTF,
      damper3GLTF,
      damper4GLTF,
      damper5GLTF,
      preFilter1GLTF,
      preFilter2GLTF,
      sensor1GLTF,
      sensor2GLTF,
    ]
  );

  // 3) Select only the visible ones
  const visibleScenes = useMemo(
    () =>
      Object.entries(gltfMap)
        .filter(([name]) => visibility[name])
        .map(([, { scene }]) => scene),
    [visibility, gltfMap]
  );

  // 4) Clone them so we don’t mutate the shared cache
  const clones = useMemo(
    () => visibleScenes.map((scene) => scene.clone(true)),
    [visibleScenes]
  );

  // 5) Recompute bounding‐box, recenter group, and fire callback
  useEffect(() => {
    if (clones.length === 0) return;
    const box = new THREE.Box3();
    clones.forEach((sc) => box.expandByObject(sc));
    const center = box.getCenter(new THREE.Vector3());

    if (!center.equals(lastCenter.current)) {
      lastCenter.current.copy(center);
      groupRef.current.position.set(-center.x, -center.y, -center.z);
      onCenterChange?.(center);
    }
  }, [clones, onCenterChange]);

  return (
    <group ref={groupRef}>
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor='#6f6f6f'
        sectionSize={5}
        sectionThickness={1}
        sectionColor='#9d4b4b'
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
      <axesHelper args={[5]} />
      {clones.map((scene, i) => (
        <primitive key={i} object={scene} />
      ))}
    </group>
  );
}

// preload all models
Object.values(modelPaths).forEach((path) => useGLTF.preload(path));

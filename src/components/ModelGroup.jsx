import { useGLTF, Grid, Html } from '@react-three/drei';
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

  // 1) load all the GLTFs at top level
  const duct = useGLTF(modelPaths.DUCT);
  const fan1 = useGLTF(modelPaths.FAN1);
  const fan2 = useGLTF(modelPaths.FAN2);
  const filter = useGLTF(modelPaths.FILTER);
  const hot = useGLTF(modelPaths.HOT);
  const cool = useGLTF(modelPaths.COOL);
  const hrw = useGLTF(modelPaths.HRW);
  const damper1 = useGLTF(modelPaths.DAMPER1);
  const sensor1 = useGLTF(modelPaths.SENSOR1);
  const sensor2 = useGLTF(modelPaths.SENSOR2);
  // …and so on for the rest…

  // 2) memo the map so its identity is stable
  const gltfMap = useMemo(
    () => ({
      DUCT: duct,
      FAN1: fan1,
      FAN2: fan2,
      FILTER: filter,
      HOT: hot,
      COOL: cool,
      HRW: hrw,
      DAMPER1: damper1,
      SENSOR1: sensor1,
      SENSOR2: sensor2,
      // …others if you like…
    }),
    [duct, fan1, fan2, filter, hot, cool, hrw, damper1, sensor1, sensor2]
  );

  // 3) build & clone only what’s visible
  const visibleScenes = useMemo(
    () =>
      Object.entries(gltfMap)
        .filter(([name]) => visibility[name])
        .map(([, { scene }]) => scene),
    [visibility, gltfMap]
  );
  const clones = useMemo(
    () => visibleScenes.map((s) => s.clone(true)),
    [visibleScenes]
  );

  // 4) center once on first load
  const didCenter = useRef(false);

  // 4) center once on load
  useEffect(() => {
    // only run on first non-empty clones
    if (didCenter.current || clones.length === 0) return;
    const box = new THREE.Box3();
    clones.forEach((sc) => box.expandByObject(sc));
    const center = box.getCenter(new THREE.Vector3());
    // shift the group so its center is at the origin
    groupRef.current.position.set(-center.x, -center.y, -center.z);
    lastCenter.current.copy(center);
    onCenterChange?.(center);
    didCenter.current = true;
  }, [clones, onCenterChange]);

  // 5) extract local‐space positions for our annotations
  const annos = useMemo(() => {
    const map = {};
    const lookup = [
      ['FAN1', fan1, 'RPM: 1 200'],
      ['FAN2', fan2, 'RPM: 1 100'],
      ['SENSOR1', sensor1, '23 °C'],
      ['SENSOR2', sensor2, '45 % RH'],
      ['DAMPER1', damper1, 'Open: 75 %'],
    ];
    lookup.forEach(([key, gltf, label]) => {
      // find by node name inside the scene
      const node = gltf.scene.getObjectByName(key);
      if (node) {
        // record its local position
        map[key] = { pos: node.position.clone(), label };
      }
    });
    return map; // e.g. { FAN1: { pos: Vector3, label: 'RPM…' }, … }
  }, [fan1, fan2, sensor1, sensor2, damper1]);

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

      {/* 6) render HTML annotations only for visible keys */}
      {Object.entries(annos).map(([key, { pos, label }]) =>
        visibility[key] ? (
          <Html
            key={key}
            transform
            position={pos.toArray()}
            center
            distanceFactor={8}
          >
            <div className='annotation'>{label}</div>
          </Html>
        ) : null
      )}
    </group>
  );
}

// preload everything
Object.values(modelPaths).forEach((p) => useGLTF.preload(p));

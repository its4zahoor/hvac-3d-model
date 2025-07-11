import { useGLTF, Grid, Html } from '@react-three/drei';
import { useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import AnnotationBox from './Annotations';

const modelPaths = {
  DUCT: '/models/DUCT.glb',
  FAN1: '/models/FAN1.glb',
  FAN2: '/models/FAN2.glb',
  FAN1LEAF: '/models/FAN1LEAF.glb',
  FAN2LEAF: '/models/FAN2LEAF.glb',
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

// Animated Fan Component
function AnimatedFan({ scene, isAnimating, speed = 2 }) {
  const pivotRef = useRef();

  useEffect(() => {
    if (scene) {
      const clone = scene.clone(true);
      const fanMesh = clone.children[0]; // Assumes 1 mesh inside

      if (fanMesh) {
        // Compute center of geometry in local space
        const bbox = new THREE.Box3().setFromObject(fanMesh);
        const center = new THREE.Vector3();
        bbox.getCenter(center);

        // Offset mesh so its center aligns with the pivot group's origin
        fanMesh.position.sub(center);

        // Add mesh to pivot group
        pivotRef.current.add(fanMesh);

        // Move pivot group to where fanMesh was originally
        pivotRef.current.position.copy(center);
      } else {
        console.warn('Fan mesh not found in scene.');
      }
    }
  }, [scene]);

  useFrame((_, delta) => {
    if (isAnimating && pivotRef.current) {
      pivotRef.current.rotation.z += delta * speed;
    }
  });

  return <group ref={pivotRef} />;
}

export default function ModelGroup({
  visibility,
  onCenterChange,
  fanAnimation,
}) {
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
  const damper2 = useGLTF(modelPaths.DAMPER2);
  const damper3 = useGLTF(modelPaths.DAMPER3);
  const damper4 = useGLTF(modelPaths.DAMPER4);
  const damper5 = useGLTF(modelPaths.DAMPER5);
  const preFilter1 = useGLTF(modelPaths['PRE-FILTER1']);
  const preFilter2 = useGLTF(modelPaths['PRE-FILTER2']);
  const sensor1 = useGLTF(modelPaths.SENSOR1);
  const sensor2 = useGLTF(modelPaths.SENSOR2);
  const fan1leaf = useGLTF(modelPaths.FAN1LEAF);
  const fan2leaf = useGLTF(modelPaths.FAN2LEAF);

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
      DAMPER2: damper2,
      DAMPER3: damper3,
      DAMPER4: damper4,
      DAMPER5: damper5,
      'PRE-FILTER1': preFilter1,
      'PRE-FILTER2': preFilter2,
      SENSOR1: sensor1,
      SENSOR2: sensor2,
      FAN1LEAF: fan1leaf,
      FAN2LEAF: fan2leaf,
    }),
    [
      duct,
      fan1,
      fan2,
      filter,
      hot,
      cool,
      hrw,
      damper1,
      damper2,
      damper3,
      damper4,
      damper5,
      preFilter1,
      preFilter2,
      sensor1,
      sensor2,
      fan1leaf,
      fan2leaf,
    ]
  );

  // 3) build & clone only what's visible
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
      [
        'FAN1',
        fan1,
        [
          { label: 'RPM', value: fanAnimation ? '1200' : '0' },
          { label: 'Speed', value: fanAnimation ? '1200' : '0' },
        ],
      ],
      [
        'FAN2',
        fan2,
        [
          { label: 'RPM', value: fanAnimation ? '1100' : '0' },
          { label: 'Speed', value: fanAnimation ? '1100' : '0' },
        ],
      ],
      [
        'SENSOR1',
        sensor1,
        [
          { label: 'Temp', value: '23°C' },
          { label: 'Humidity', value: '45 %' },
        ],
      ],
      [
        'DAMPER1',
        damper1,
        [
          { label: 'Open', value: '75%' },
          { label: 'Position', value: '0.75' },
        ],
      ],
    ];
    lookup.forEach(([key, gltf, data]) => {
      // find by node name inside the scene
      const node = gltf.scene.getObjectByName(key);
      if (node) {
        // record its local position and data
        map[key] = { pos: node.position.clone(), data };
      }
    });
    return map; // e.g. { FAN1: { pos: Vector3, data: [...] }, … }
  }, [fan1, fan2, sensor1, damper1, fanAnimation]);

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

      {/* Render fans with animation */}
      {visibility.FAN1LEAF && (
        <AnimatedFan
          scene={fan1leaf.scene.clone(true)}
          isAnimating={fanAnimation}
          speed={2}
        />
      )}
      {visibility.FAN2LEAF && (
        <AnimatedFan
          scene={fan2leaf.scene.clone(true)}
          isAnimating={fanAnimation}
          speed={1.5}
        />
      )}

      {/* Render other components normally */}
      {Object.entries(gltfMap)
        .filter(
          ([name]) =>
            visibility[name] && name !== 'FAN1LEAF' && name !== 'FAN2LEAF'
        )
        .map(([, { scene }], i) => (
          <primitive key={i} object={scene.clone(true)} />
        ))}

      {/* 6) render HTML annotations only for visible keys */}
      {Object.entries(annos).map(([key, { pos, data }]) =>
        visibility[key] ? (
          <Html
            key={key}
            transform
            position={pos.toArray()}
            center
            distanceFactor={8}
          >
            <AnnotationBox data={data} />
          </Html>
        ) : null
      )}
    </group>
  );
}

// preload everything
Object.values(modelPaths).forEach((p) => useGLTF.preload(p));

// src/components/ModelGroup.jsx
import { useGLTF } from '@react-three/drei';
import { Grid } from '@react-three/drei';
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
  PRE_FILTER1: '/models/PRE-FILTER1.glb',
  PRE_FILTER2: '/models/PRE-FILTER2.glb',
  SENSOR1: '/models/SENSOR1.glb',
  SENSOR2: '/models/SENSOR2.glb',
};

export default function ModelGroup({ visibility, onCenterChange }) {
  const groupRef = useRef();

  // Load all models
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
  const preFilter1GLTF = useGLTF(modelPaths.PRE_FILTER1);
  const preFilter2GLTF = useGLTF(modelPaths.PRE_FILTER2);
  const sensor1GLTF = useGLTF(modelPaths.SENSOR1);
  const sensor2GLTF = useGLTF(modelPaths.SENSOR2);

  const gltfMap = {
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
    PRE_FILTER1: preFilter1GLTF,
    PRE_FILTER2: preFilter2GLTF,
    SENSOR1: sensor1GLTF,
    SENSOR2: sensor2GLTF,
  };

  // Only consider visible models
  const visibleModelNames = Object.keys(modelPaths).filter(
    (name) => visibility[name]
  );
  const allVisibleLoaded = visibleModelNames.every(
    (name) => gltfMap[name] && gltfMap[name].scene
  );

  // Only the visible ones, cloned (memoized)
  const loadedModels = useMemo(() => {
    return visibleModelNames
      .map((name) =>
        gltfMap[name] && gltfMap[name].scene
          ? gltfMap[name].scene.clone()
          : null
      )
      .filter(Boolean);
  }, [visibility, allVisibleLoaded]);

  // Compute bounding box and center
  useEffect(() => {
    if (loadedModels.length === 0) return;
    const box = new THREE.Box3();
    loadedModels.forEach((scene) => {
      box.expandByObject(scene);
    });
    const center = new THREE.Vector3();
    box.getCenter(center);
    // Notify parent of new center
    if (onCenterChange) onCenterChange(center);
    // Center the group
    if (groupRef.current) {
      groupRef.current.position.set(-center.x, -center.y, -center.z);
    }
  }, [loadedModels, onCenterChange]);

  // Only render when all visible models are loaded
  if (visibleModelNames.length > 0 && !allVisibleLoaded) return null;

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
      {loadedModels.map((scene, idx) => (
        <primitive key={idx} object={scene} />
      ))}
    </group>
  );
}

useGLTF.preload = Object.values(modelPaths);

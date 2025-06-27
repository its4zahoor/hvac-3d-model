// src/components/ModelGroup.jsx
import { useGLTF } from '@react-three/drei';

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

export default function ModelGroup({ visibility }) {
  return (
    <group>
      {Object.entries(modelPaths).map(([name, path]) => {
        if (!visibility[name]) return null;
        return <Model key={name} path={path} />;
      })}
    </group>
  );
}

function Model({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

useGLTF.preload = Object.values(modelPaths);

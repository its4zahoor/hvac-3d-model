import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ModelGroup from './components/ModelGroup';

const MODEL_LIST = [
  'DUCT',
  'FAN1',
  'FAN2',
  'FILTER',
  'HOT',
  'COOL',
  'HRW',
  'DAMPER1',
  'DAMPER2',
  'DAMPER3',
  'DAMPER4',
  'DAMPER5',
  'PRE-FILTER1',
  'PRE-FILTER2',
  'SENSOR1',
  'SENSOR2',
];

export default function App() {
  const [visibility, setVisibility] = useState(
    Object.fromEntries(MODEL_LIST.map((name) => [name, true]))
  );
  const [modelCenter, setModelCenter] = useState([0, 0, 0]);

  const toggleVisibility = (name) => {
    setVisibility((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleCenterChange = (center) => {
    setModelCenter([center.x, center.y, center.z]);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#1e1e1e',
      }}
    >
      <aside
        style={{
          width: '250px',
          padding: '1rem',
          background: '#2a2a2a',
          color: '#fff',
          overflowY: 'auto',
          zIndex: 10,
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Toggle Parts</h3>
        {MODEL_LIST.map((name) => (
          <div key={name} style={{ marginBottom: '0.5rem' }}>
            <label style={{ cursor: 'pointer' }}>
              <input
                type='checkbox'
                checked={visibility[name]}
                onChange={() => toggleVisibility(name)}
                style={{ marginRight: '0.5rem' }}
              />
              {name}
            </label>
          </div>
        ))}
      </aside>

      <main
        style={{ flex: 1, flexGrow: 1, minWidth: 800, position: 'relative' }}
      >
        <Canvas
          camera={{ position: [5, 3, 8], fov: 60 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <directionalLight position={[-10, -10, -5]} intensity={0.4} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={20}
            target={modelCenter}
          />
          <ModelGroup
            visibility={visibility}
            onCenterChange={handleCenterChange}
          />
        </Canvas>
      </main>
    </div>
  );
}

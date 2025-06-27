// src/App.jsx
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

  const toggleVisibility = (name) => {
    setVisibility((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: '250px', padding: '1rem', background: '#f0f0f0' }}>
        <h3>Toggle Parts</h3>
        {MODEL_LIST.map((name) => (
          <div key={name}>
            <label>
              <input
                type='checkbox'
                checked={visibility[name]}
                onChange={() => toggleVisibility(name)}
              />
              {name}
            </label>
          </div>
        ))}
      </aside>

      <main style={{ flexGrow: 1 }}>
        <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <OrbitControls />
          <ModelGroup visibility={visibility} />
        </Canvas>
      </main>
    </div>
  );
}

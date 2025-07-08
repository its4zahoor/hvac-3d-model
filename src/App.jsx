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
  const [fanAnimation, setFanAnimation] = useState(false);

  const toggleVisibility = (name) => {
    setVisibility((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleFanAnimation = () => {
    setFanAnimation((prev) => !prev);
  };

  const handleCenterChange = (center) => {
    setModelCenter([center.x, center.y, center.z]);
  };

  return (
    <div className='flex flex-col sm:flex-row h-screen w-screen bg-neutral-900'>
      <aside className='w-full sm:w-[250px] p-2 sm:p-4 bg-neutral-800 text-white z-10 border-b sm:border-b-0 sm:border-r border-neutral-700 flex-shrink-0'>
        <h3 className='mb-2 sm:mb-4 text-base sm:text-lg font-semibold tracking-wide text-center sm:text-left'>
          Visible Components
        </h3>
        <div className='grid grid-cols-2 sm:flex sm:flex-col gap-x-2 gap-y-1 sm:gap-x-0 sm:gap-y-2'>
          {MODEL_LIST.map((name) => (
            <div key={name} className='flex items-center flex-shrink-0'>
              <label className='flex items-center cursor-pointer select-none'>
                <input
                  type='checkbox'
                  checked={visibility[name]}
                  onChange={() => toggleVisibility(name)}
                  className='mr-2 accent-blue-500 w-4 h-4 rounded focus:ring-2 focus:ring-blue-400'
                />
                <span className='text-xs sm:text-sm font-medium whitespace-nowrap'>
                  {name}
                </span>
              </label>
            </div>
          ))}
        </div>

        {/* Fan Animation Toggle */}
        <div className='mt-4 pt-4 border-t border-neutral-700'>
          <button
            onClick={toggleFanAnimation}
            className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              fanAnimation
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-neutral-700 hover:bg-neutral-600 text-white'
            }`}
          >
            {fanAnimation ? '🔄 Fans Running' : '⏸️ Fans Stopped'}
          </button>
        </div>
      </aside>
      <main className='flex-1 min-w-0 relative min-h-[300px]'>
        <Canvas
          camera={{ position: [5, 3, 8], fov: 60 }}
          className='w-full h-[60vh] sm:h-full'
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
            fanAnimation={fanAnimation}
          />
        </Canvas>
      </main>
    </div>
  );
}

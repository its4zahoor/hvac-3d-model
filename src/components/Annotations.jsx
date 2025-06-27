import React from 'react';

export default function AnnotationBox({ data }) {
  return (
    <div className='px-1.5 py-0.5 rounded-md shadow bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-[10px] text-neutral-900 dark:text-neutral-100 min-w-[36px] max-w-[90px] pointer-events-none'>
      {data.map(({ label, value }, i) => (
        <div className='flex justify-between mb-0.5 last:mb-0' key={i}>
          <span className='text-[10px] font-medium'>{label}</span>
          <span className='text-[10px]'>{value}</span>
        </div>
      ))}
    </div>
  );
}

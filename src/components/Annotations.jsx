import React from 'react';
import './AnnotationBox.css';

export default function AnnotationBox({ speed, heat }) {
  return (
    <div className='annotation-box'>
      <div className='annotation-line'>
        <span className='label'>Speed:</span>
        <span className='value'>{speed}</span>
      </div>
      <div className='annotation-line'>
        <span className='label'>Heat:</span>
        <span className='value'>{heat}°</span>
      </div>
    </div>
  );
}

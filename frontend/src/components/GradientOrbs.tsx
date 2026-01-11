import React from 'react';

const GradientOrbs: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large blue orb top-left */}
      <div
        className="absolute w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
        style={{ top: '-10%', left: '-5%', animationDelay: '0s' }}
      />
      
      {/* Medium blue orb top-right */}
      <div
        className="absolute w-80 h-80 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
        style={{ top: '10%', right: '-5%', animationDelay: '2s' }}
      />
      
      {/* Orange accent orb middle-left */}
      <div
        className="absolute w-72 h-72 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float"
        style={{ top: '40%', left: '5%', animationDelay: '1s' }}
      />
      
      {/* Cyan orb middle-right */}
      <div
        className="absolute w-64 h-64 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
        style={{ top: '50%', right: '10%', animationDelay: '3s' }}
      />
      
      {/* Small blue orb bottom-left */}
      <div
        className="absolute w-56 h-56 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float"
        style={{ bottom: '10%', left: '20%', animationDelay: '1.5s' }}
      />
      
      {/* Amber accent orb bottom-right */}
      <div
        className="absolute w-60 h-60 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float"
        style={{ bottom: '-5%', right: '15%', animationDelay: '2.5s' }}
      />
    </div>
  );
};

export default GradientOrbs;

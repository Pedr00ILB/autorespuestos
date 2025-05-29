import { useState } from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'red' | 'green' | 'yellow';
  className?: string;
}

export default function Spinner({ 
  size = 'medium', 
  color = 'blue', 
  className = ''
}: SpinnerProps) {
  const sizes = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const colors = {
    blue: 'border-blue-500',
    red: 'border-red-500',
    green: 'border-green-500',
    yellow: 'border-yellow-500'
  };

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Cargando"
    >
      <div className={`animate-spin rounded-full ${sizes[size]} border-2 border-t-transparent ${colors[color]}`}>
      </div>
    </div>
  );
}

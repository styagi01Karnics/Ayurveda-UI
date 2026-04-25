import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  center?: boolean;
}

export default function LoadingSpinner({ size = 'md', center = false }: Props) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const spinner = (
    <div
      className={`${sizes[size]} rounded-full border-4 border-t-transparent spinner`}
      style={{ borderColor: '#B8860B', borderTopColor: 'transparent' }}
    />
  );
  if (center) {
    return <div className="flex items-center justify-center py-16">{spinner}</div>;
  }
  return spinner;
}

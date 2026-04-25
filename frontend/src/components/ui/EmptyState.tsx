import React, { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      {icon && (
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#F0E8D6' }}>
          <div style={{ color: '#B8860B' }}>{icon}</div>
        </div>
      )}
      <p className="font-semibold text-base" style={{ color: '#2D1B00' }}>{title}</p>
      {description && <p className="text-sm text-center max-w-sm" style={{ color: '#9C7040' }}>{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

import React from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltMaxAngle?: number;
  enableGlow?: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

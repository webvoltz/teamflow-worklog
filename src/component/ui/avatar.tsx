import { type CSSProperties } from 'react';
import { cn } from '../../utils/cn';

export interface AvatarProps {
  src?: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

export function Avatar({ src, size = 40, className, style, children }: Readonly<AvatarProps>) {
  const dimension = { width: size, height: size, ...style };
  if (src) {
    return (
      <img
        src={src}
        alt="Avatar"
        style={dimension}
        className={cn('rounded-full object-cover', className)}
      />
    );
  }
  return (
    <span
      style={dimension}
      className={cn(
        'flex items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
}

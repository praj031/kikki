import { forwardRef } from 'react';
import { User } from './Icons';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: React.ReactNode;
}

const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, name, size = 'md', className = '', fallback }, ref) => {
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const gradientColors = [
      'from-blue-500 to-purple-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500',
      'from-cyan-500 to-blue-500',
      'from-violet-500 to-purple-500',
    ];

    // Generate a consistent gradient based on name
    const gradientIndex = name
      ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradientColors.length
      : 0;

    return (
      <div
        ref={ref}
        className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br ${gradientColors[gradientIndex]} ${sizeStyles[size]} ${className}`}
      >
        {src ? (
          <img src={src} alt={alt || name} className="w-full h-full object-cover" />
        ) : name ? (
          <span className="text-white font-semibold">{getInitials(name)}</span>
        ) : fallback ? (
          fallback
        ) : (
          <User className="w-1/2 h-1/2 text-white" />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

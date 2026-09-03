import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { User } from 'lucide-react';

/**
 * Avatar component for displaying user avatars
 *
 * @param {object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.name - User name (for initials fallback)
 * @param {string} props.size - Avatar size (xs, sm, md, lg, xl)
 * @param {string} props.status - Status indicator (online, offline, busy, away)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Avatar component
 */
const Avatar = ({
  src,
  alt = 'User avatar',
  name,
  size = 'md',
  status,
  className = ''
}) => {
  const { isDarkMode } = useTheme();

  // Size classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  // Status color classes
  const statusColorClasses = {
    online: 'bg-emerald-500',
    offline: 'bg-gray-400',
    busy: 'bg-yellow-500',
    away: 'bg-blue-500'
  };

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Generate background color from name
  const getBgColor = (name) => {
    if (!name) return 'bg-blue-500';
    const colors = [
      'bg-blue-500', 'bg-emerald-500', 'bg-purple-500',
      'bg-red-500', 'bg-yellow-500', 'bg-cyan-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Avatar */}
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full overflow-hidden flex items-center justify-center
          font-medium text-white bg-gray-400
        `}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'user'}`;
            }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${getBgColor(name)}`}>
            {getInitials(name)}
          </div>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-gray-800
            ${statusColorClasses[status] || 'bg-gray-400'}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;
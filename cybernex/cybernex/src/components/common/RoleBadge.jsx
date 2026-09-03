import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ROLES } from '../../utils/constants';
import Badge from './Badge';

/**
 * Role Badge component for displaying user roles
 *
 * @param {object} props - Component props
 * @param {string} props.role - User role (admin, faculty, student)
 * @param {string} props.size - Badge size (sm, md, lg)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Role Badge component
 */
const RoleBadge = ({ role, size = 'sm', className = '' }) => {
  const { isDarkMode } = useTheme();

  // Get display name and variant for each role
  const roleConfig = {
    [ROLES.ADMIN]: {
      label: 'Admin',
      variant: 'danger',
      icon: '👑'
    },
    [ROLES.FACULTY]: {
      label: 'Faculty',
      variant: 'primary',
      icon: '👨‍🏫'
    },
    [ROLES.STUDENT]: {
      label: 'Student',
      variant: 'success',
      icon: '👩‍🎓'
    }
  };

  const config = roleConfig[role] || roleConfig[ROLES.STUDENT];

  return (
    <Badge
      variant={config.variant}
      size={size}
      className={className}
    >
      {config.icon} {config.label}
    </Badge>
  );
};

export default RoleBadge;
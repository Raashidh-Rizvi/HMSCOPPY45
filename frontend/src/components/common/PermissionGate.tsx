import React from 'react';
import { usePermissions } from '@/context/PermissionsContext';

interface PermissionGateProps {
  module: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  module,
  action,
  children,
  fallback = null
}) => {
  const { hasPermission } = usePermissions();

  if (hasPermission(module, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default PermissionGate;
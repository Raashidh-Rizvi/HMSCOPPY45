import { usePermissions as usePermissionsContext } from '@/context/PermissionsContext';

export const usePermissions = () => {
  const context = usePermissionsContext();
  
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  
  return context;
};

// Hook for checking specific permissions
export const useHasPermission = (module: string, action: string) => {
  const { hasPermission } = usePermissions();
  return hasPermission(module, action);
};

// Hook for checking multiple permissions
export const useHasAnyPermission = (permissions: Array<{ module: string; action: string }>) => {
  const { hasPermission } = usePermissions();
  return permissions.some(({ module, action }) => hasPermission(module, action));
};

// Hook for checking all permissions
export const useHasAllPermissions = (permissions: Array<{ module: string; action: string }>) => {
  const { hasPermission } = usePermissions();
  return permissions.every(({ module, action }) => hasPermission(module, action));
};
"use client";

import { useAuthContext } from "@/contexts/auth-context";

interface RoleGuardProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  roles = [],
  permissions = [],
  requireAll = false,
  fallback = null,
}: RoleGuardProps) {
  const { hasAnyRole, hasAnyPermission, hasRole, hasPermission } =
    useAuthContext();

  // Check if user meets the role requirements
  const hasRequiredRoles = () => {
    if (roles.length === 0) return true;

    if (requireAll) {
      return roles.every((role) => hasRole(role));
    }
    return hasAnyRole(roles);
  };

  // Check if user meets the permission requirements
  const hasRequiredPermissions = () => {
    if (permissions.length === 0) return true;

    if (requireAll) {
      return permissions.every((permission) => hasPermission(permission));
    }
    return hasAnyPermission(permissions);
  };

  // Show content if user has required roles and permissions
  if (hasRequiredRoles() && hasRequiredPermissions()) {
    return <>{children}</>;
  }

  // Show fallback or nothing
  return <>{fallback}</>;
}

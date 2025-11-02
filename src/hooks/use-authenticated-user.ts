"use client";

import { useAuthContext } from "@/contexts/auth-context";

/**
 * Hook for accessing authenticated user data in protected pages.
 *
 * This hook assumes that authentication is already handled by RouteGuard.
 * It should only be used in pages that are wrapped by RouteGuard.
 *
 * Unlike useAuthContext, this hook:
 * - Does not handle authentication flow or redirects
 * - Assumes the user is already authenticated
 * - Focuses on providing user data for business logic
 * - Throws an error if used outside of an authenticated context
 *
 * @returns Authenticated user data and utility functions
 */
export function useAuthenticatedUser() {
  const {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    isAdmin,
    isStaff,
    updateUser,
  } = useAuthContext();

  // In development, provide helpful error messages
  if (process.env.NODE_ENV === "development") {
    if (!isAuthenticated && !isLoading) {
      throw new Error(
        "useAuthenticatedUser: User is not authenticated. This hook should only be used in pages protected by RouteGuard.",
      );
    }

    if (!user && !isLoading) {
      throw new Error(
        "useAuthenticatedUser: User data is not available. This hook should only be used in pages protected by RouteGuard.",
      );
    }
  }

  return {
    // User data (guaranteed to be available in protected pages)
    user: user!,

    // Loading state (for business logic, not auth)
    isLoading,

    // Role and permission utilities
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    isAdmin,
    isStaff,

    // User management
    updateUser,
  };
}

/**
 * Hook for accessing user data with optional authentication.
 *
 * This is useful for components that might be used in both
 * authenticated and non-authenticated contexts.
 *
 * @returns User data if authenticated, null otherwise
 */
export function useOptionalUser() {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  return {
    user: isAuthenticated ? user : null,
    isAuthenticated,
    isLoading,
  };
}

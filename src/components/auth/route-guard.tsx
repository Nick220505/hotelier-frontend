"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-context";

interface RouteGuardProps {
  children: React.ReactNode;
}

// Loading component for authentication
function AuthLoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Verificando autenticación...</p>
      </div>
    </div>
  );
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading, checkAuthStatus, user, hasRole } =
    useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const hasCheckedRef = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Check if current path is an auth page
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Check if user should be redirected based on role and current path
  const checkRoleBasedRedirection = useCallback(() => {
    if (!isAuthenticated || !user || isLoading) return;

    // If user is a client and tries to access dashboard, redirect to mis-reservas
    if (hasRole("cliente") && pathname === "/") {
      router.replace("/mis-reservas");
      return;
    }

    // If user is a client and on login page after authentication, redirect to mis-reservas
    if (hasRole("cliente") && isAuthPage) {
      router.replace("/mis-reservas");
      return;
    }

    // If authenticated user tries to access auth pages, redirect to dashboard
    if (isAuthPage && !hasRole("cliente")) {
      router.replace("/");
      return;
    }
  }, [isAuthenticated, user, hasRole, pathname, router, isLoading, isAuthPage]);

  // Main authentication effect
  useEffect(() => {
    // Don't run on server or before hydration
    if (!isHydrated) return;

    // If still loading, wait
    if (isLoading) return;

    // If authenticated, handle role-based redirections
    if (isAuthenticated) {
      hasCheckedRef.current = false;
      checkRoleBasedRedirection();
      return;
    }

    // Not authenticated - check if we should try to restore auth
    const hasToken =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    // If there's a token but we're not authenticated, check auth status once
    if (hasToken && !hasCheckedRef.current) {
      hasCheckedRef.current = true;
      checkAuthStatus();
      return;
    }

    // No token or already checked - redirect to login if not on auth page
    if (!isAuthPage) {
      router.replace("/login");
    }
  }, [
    isAuthenticated,
    isLoading,
    pathname,
    router,
    checkAuthStatus,
    checkRoleBasedRedirection,
    isHydrated,
    isAuthPage,
  ]);

  // Don't render anything until hydrated
  if (!isHydrated) {
    return null;
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  // Don't render children if not authenticated and not on auth page
  if (!isAuthenticated && !isAuthPage) {
    return <AuthLoadingSpinner />;
  }

  // All checks passed - render children
  return <>{children}</>;
}

"use client";

import { useAuthContext } from "@/contexts/auth-context";
import { useEffect } from "react";

export function NavigationUpdater() {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated || isLoading || !user) {
      return;
    }

    // Dispatch navigation update events when user is authenticated
    // Don't require permissions.length to be > 0 as permissions might still be loading
    const events = [
      "navigation-update",
      "auth-context-update",
      "auth-force-update",
      "navigation-sync",
    ];

    events.forEach((eventName) => {
      const eventData = {
        detail: {
          user,
          permissions: user.permissions || [],
          roles: user.roles || [],
          authenticated: true,
        },
      };
      window.dispatchEvent(new CustomEvent(eventName, eventData));
    });
  }, [isAuthenticated, user, isLoading]);

  return null;
}

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_DATA_KEY = "user_data";

interface UserData {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: unknown;
}

export const authCookies = {
  setTokens: (accessToken: string, refreshToken: string) => {
    // For client-side
    if (typeof window !== "undefined") {
      // Set cookies with longer expiration times (remove Secure for localhost)
      document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      document.cookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;
      // Also store in localStorage for compatibility
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  setUserData: (userData: UserData) => {
    if (typeof window !== "undefined") {
      const userDataString = JSON.stringify(userData);
      const encodedUserData = encodeURIComponent(userDataString);
      document.cookie = `${USER_DATA_KEY}=${encodedUserData}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      // Always keep a localStorage backup for reliability
      localStorage.setItem("user_data", userDataString);

      // Also store individual pieces for easier access
      localStorage.setItem("user_roles", JSON.stringify(userData.roles || []));
      localStorage.setItem(
        "user_permissions",
        JSON.stringify(userData.permissions || []),
      );
    }
  },

  getAccessToken: () => {
    if (typeof window !== "undefined") {
      // Client-side - try localStorage first, then cookies
      const localToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (localToken) return localToken;

      const match = document.cookie.match(
        new RegExp(`(^| )${ACCESS_TOKEN_KEY}=([^;]+)`),
      );
      return match ? match[2] : null;
    }
    // Server-side - no access to cookies in SSR for now, return null
    return null;
  },

  getRefreshToken: () => {
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (localToken) return localToken;

      const match = document.cookie.match(
        new RegExp(`(^| )${REFRESH_TOKEN_KEY}=([^;]+)`),
      );
      return match ? match[2] : null;
    }
    return null;
  },

  getUserData: () => {
    if (typeof window !== "undefined") {
      // Try localStorage first (most reliable)
      const localData = localStorage.getItem("user_data");
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          return parsedData;
        } catch (error) {
          console.warn("Error parsing localStorage user data:", error);
          // Continue to try cookies
        }
      }

      // Fallback to cookies
      const match = document.cookie.match(
        new RegExp(`(^| )${USER_DATA_KEY}=([^;]+)`),
      );
      if (match) {
        try {
          const parsedData = JSON.parse(decodeURIComponent(match[2]));
          return parsedData;
        } catch (error) {
          console.warn("Error parsing cookie user data:", error);
          return null;
        }
      }
    }
    return null;
  },

  clearAll: () => {
    if (typeof window !== "undefined") {
      // Clear cookies
      document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
      document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
      document.cookie = `${USER_DATA_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;

      // Clear localStorage
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem("user_data");
      localStorage.removeItem("user_roles");
      localStorage.removeItem("user_permissions");
    }
  },
};

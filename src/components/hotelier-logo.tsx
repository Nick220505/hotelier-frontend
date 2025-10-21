"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface HotelierLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "icon" | "modern" | "full";
  showBackground?: boolean;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const fullLogoSizes = {
  sm: "h-8 w-24",
  md: "h-10 w-32",
  lg: "h-16 w-48",
  xl: "h-20 w-60",
};

export function HotelierLogo({
  className = "",
  size = "md",
  variant = "icon",
  showBackground = false,
}: HotelierLogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getLogoSrc = () => {
    // If not mounted yet, return default logo to prevent hydration mismatch
    if (!mounted) {
      return "/logo.png";
    }

    // Determine if we should show dark version
    const isDarkMode =
      resolvedTheme === "dark" ||
      (theme === "system" && resolvedTheme === "dark");

    switch (variant) {
      case "full":
        return isDarkMode ? "/logo-black.png" : "/logo.png";
      case "modern":
        return isDarkMode ? "/logo-black.png" : "/logo.png";
      default:
        return isDarkMode ? "/logo-black.png" : "/logo.png";
    }
  };

  const getSizeClass = () => {
    return variant === "full" ? fullLogoSizes[size] : sizeClasses[size];
  };

  const logoSrc = getLogoSrc();
  const sizeClass = getSizeClass();

  const backgroundClass = showBackground
    ? "bg-linear-to-br from-indigo-500 via-blue-500 via-cyan-500 to-emerald-500 rounded-lg p-1"
    : "";

  return (
    <div
      className={`flex items-center justify-center ${backgroundClass} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt="Hotelier"
        className={`${sizeClass} object-contain`}
      />
    </div>
  );
}

export default HotelierLogo;

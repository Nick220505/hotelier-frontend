/**
 * Design Tokens for Hotelier Application
 * Centralized design system tokens following hotel industry best practices
 */

// Color Tokens
export const tokens = {
  colors: {
    // Core Brand Colors
    brand: {
      primary: {
        50: "hsl(212 100% 97%)",
        100: "hsl(212 100% 92%)",
        200: "hsl(212 94% 85%)",
        300: "hsl(212 92% 76%)",
        400: "hsl(212 89% 65%)",
        500: "hsl(212 86% 45%)", // Main brand color
        600: "hsl(212 82% 38%)",
        700: "hsl(212 78% 32%)",
        800: "hsl(212 74% 26%)",
        900: "hsl(212 70% 21%)",
        950: "hsl(212 66% 14%)",
      },
      secondary: {
        50: "hsl(210 20% 98%)",
        100: "hsl(210 20% 96%)",
        200: "hsl(210 20% 92%)",
        300: "hsl(210 20% 85%)",
        400: "hsl(210 20% 76%)",
        500: "hsl(210 20% 65%)",
        600: "hsl(210 20% 55%)",
        700: "hsl(210 20% 45%)",
        800: "hsl(210 20% 35%)",
        900: "hsl(210 20% 25%)",
        950: "hsl(210 20% 15%)",
      },
    },

    // Semantic Colors
    semantic: {
      success: {
        light: "hsl(142 71% 55%)",
        main: "hsl(142 71% 45%)",
        dark: "hsl(142 71% 35%)",
      },
      warning: {
        light: "hsl(38 92% 60%)",
        main: "hsl(38 92% 50%)",
        dark: "hsl(38 92% 40%)",
      },
      error: {
        light: "hsl(0 84% 70%)",
        main: "hsl(0 84% 60%)",
        dark: "hsl(0 84% 50%)",
      },
      info: {
        light: "hsl(188 94% 52%)",
        main: "hsl(188 94% 42%)",
        dark: "hsl(188 94% 32%)",
      },
    },

    // Hotel-Specific Status Colors
    room: {
      available: "hsl(142 71% 45%)", // Green
      occupied: "hsl(212 86% 45%)", // Blue
      maintenance: "hsl(38 92% 50%)", // Amber
      cleaning: "hsl(188 94% 42%)", // Cyan
      outOfOrder: "hsl(0 84% 60%)", // Red
    },

    booking: {
      confirmed: "hsl(142 71% 45%)",
      pending: "hsl(38 92% 50%)",
      cancelled: "hsl(0 84% 60%)",
      noShow: "hsl(215 25% 46%)",
      checkedIn: "hsl(212 86% 45%)",
      checkedOut: "hsl(214 32% 76%)",
    },

    payment: {
      paid: "hsl(142 71% 45%)",
      pending: "hsl(38 92% 50%)",
      overdue: "hsl(0 84% 60%)",
      partial: "hsl(212 86% 45%)",
    },

    // Priority Colors
    priority: {
      low: "hsl(142 71% 45%)",
      medium: "hsl(38 92% 50%)",
      high: "hsl(25 95% 55%)",
      urgent: "hsl(0 84% 40%)",
    },

    // Chart/Data Visualization
    chart: [
      "hsl(212 86% 45%)", // Hotel blue
      "hsl(142 71% 45%)", // Success green
      "hsl(38 92% 50%)", // Warning amber
      "hsl(188 94% 42%)", // Info cyan
      "hsl(260 65% 55%)", // Luxury purple
      "hsl(25 95% 55%)", // Orange
      "hsl(340 75% 55%)", // Pink
      "hsl(120 60% 50%)", // Emerald
    ],
  },

  // Typography Scale
  typography: {
    fontSizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },

    fontWeights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },

    lineHeights: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },

  // Spacing Scale (8px grid)
  spacing: {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
  },

  // Border Radius
  radii: {
    none: "0",
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 hsl(0 0% 0% / 0.05)",
    md: "0 4px 6px -1px hsl(0 0% 0% / 0.1), 0 2px 4px -2px hsl(0 0% 0% / 0.1)",
    lg: "0 10px 15px -3px hsl(0 0% 0% / 0.1), 0 4px 6px -4px hsl(0 0% 0% / 0.1)",
    xl: "0 20px 25px -5px hsl(0 0% 0% / 0.1), 0 8px 10px -6px hsl(0 0% 0% / 0.1)",
    "2xl": "0 25px 50px -12px hsl(0 0% 0% / 0.25)",
  },

  // Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Z-index Scale
  zIndex: {
    auto: "auto",
    0: "0",
    10: "10",
    20: "20",
    30: "30",
    40: "40",
    50: "50",
    dropdown: "1000",
    sticky: "1020",
    fixed: "1030",
    backdrop: "1040",
    modal: "1050",
    popover: "1060",
    tooltip: "1070",
  },

  // Animation Durations
  durations: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },

  // Easing Functions
  easings: {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
} as const;

// Type exports for better TypeScript support
export type ColorScale = typeof tokens.colors.brand.primary;
export type SemanticColor = keyof typeof tokens.colors.semantic;
export type RoomStatusColor = keyof typeof tokens.colors.room;
export type BookingStatusColor = keyof typeof tokens.colors.booking;
export type PaymentStatusColor = keyof typeof tokens.colors.payment;
export type PriorityColor = keyof typeof tokens.colors.priority;

// Utility functions for accessing tokens
export const getColor = (path: string) => {
  const keys = path.split(".");
  let value: unknown = tokens.colors;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return value;
};

export const getSpacing = (size: keyof typeof tokens.spacing) =>
  tokens.spacing[size];
export const getRadius = (size: keyof typeof tokens.radii) =>
  tokens.radii[size];
export const getShadow = (size: keyof typeof tokens.shadows) =>
  tokens.shadows[size];

// CSS Custom Properties Generator
export const generateCSSCustomProperties = () => {
  const properties: Record<string, string> = {};

  // Generate color properties
  Object.entries(tokens.colors).forEach(([category, colors]) => {
    if (typeof colors === "object" && colors !== null) {
      Object.entries(colors).forEach(([name, value]) => {
        if (typeof value === "string") {
          properties[`--color-${category}-${name}`] = value;
        } else if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([shade, shadeValue]) => {
            if (typeof shadeValue === "string") {
              properties[`--color-${category}-${name}-${shade}`] = shadeValue;
            }
          });
        }
      });
    }
  });

  // Generate spacing properties
  Object.entries(tokens.spacing).forEach(([name, value]) => {
    properties[`--spacing-${name}`] = value;
  });

  return properties;
};

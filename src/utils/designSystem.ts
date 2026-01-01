// Design system colors for mobile app
export const Colors = {
   // Primary brand colors
   primary: '#3B82F6',         // Blue-500
   primaryDark: '#2563EB',     // Blue-600
   primaryLight: '#60A5FA',    // Blue-400

   // Background colors
   background: '#FFFFFF',
   backgroundSecondary: '#F8FAFC',  // Slate-50
   backgroundTertiary: '#F1F5F9',   // Slate-100

   // Text colors
   text: '#1F2937',           // Gray-800
   textSecondary: '#6B7280',  // Gray-500
   textMuted: '#9CA3AF',      // Gray-400
   textLight: '#FFFFFF',

   // Border colors
   border: '#E5E7EB',         // Gray-200
   borderLight: '#F3F4F6',    // Gray-100
   borderDark: '#D1D5DB',     // Gray-300

   // Status colors
   success: '#10B981',        // Emerald-500
   successLight: '#D1FAE5',   // Emerald-100
   error: '#EF4444',          // Red-500
   errorLight: '#FEE2E2',     // Red-100
   warning: '#F59E0B',        // Amber-500
   warningLight: '#FEF3C7',   // Amber-100
   info: '#3B82F6',           // Blue-500
   infoLight: '#DBEAFE',      // Blue-100

   // Task status colors
   pending: '#F59E0B',        // Amber-500
   completed: '#10B981',      // Emerald-500
   canceled: '#EF4444',       // Red-500

   // Utility colors
   shadow: 'rgba(0, 0, 0, 0.1)',
   overlay: 'rgba(0, 0, 0, 0.5)',
   transparent: 'transparent',
} as const;

// Spacing system (based on 4px grid)
export const Spacing = {
   xs: 4,
   sm: 8,
   md: 12,
   lg: 16,
   xl: 20,
   '2xl': 24,
   '3xl': 32,
   '4xl': 48,
   '5xl': 64,
} as const;

// Border radius system
export const BorderRadius = {
   none: 0,
   sm: 4,
   md: 6,
   lg: 8,
   xl: 12,
   '2xl': 16,
   '3xl': 24,
   full: 9999,
} as const;

// Typography scale
export const Typography = {
   fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
   },
   fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
   },
   lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
   },
} as const;

// Shadow system for elevation
export const Shadows = {
   sm: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
   },
   md: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
   },
   lg: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
   },
} as const;
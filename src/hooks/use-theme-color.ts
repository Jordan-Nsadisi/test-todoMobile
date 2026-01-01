/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Colors } from '@/src/utils/designSystem';

// Map theme colors to our design system
const themeColors = {
  light: {
    text: Colors.text,
    background: Colors.background,
    tint: Colors.primary,
    icon: Colors.textSecondary,
    tabIconDefault: Colors.textMuted,
    tabIconSelected: Colors.primary,
  },
  dark: {
    text: Colors.textLight,
    background: Colors.text,
    tint: Colors.primary,
    icon: Colors.textMuted,
    tabIconDefault: Colors.textSecondary,
    tabIconSelected: Colors.primary,
  },
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof themeColors.light
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return themeColors[theme][colorName];
  }
}

import { BorderRadius, Colors, Spacing, Typography } from '@/src/utils/designSystem';
import React from 'react';
import { StyleSheet, Text, ViewStyle } from 'react-native';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
   children: React.ReactNode;
   variant?: BadgeVariant;
   size?: BadgeSize;
   style?: ViewStyle;
}

export function Badge({
   children,
   variant = 'default',
   size = 'md',
   style,
}: BadgeProps) {
   const badgeStyles = [
      styles.base,
      styles[variant],
      styles[size],
      style,
   ];

   const textStyles = [
      styles.text,
      styles[`${variant}Text`],
      styles[`${size}Text`],
   ];

   return (
      <Text style={badgeStyles}>
         <Text style={textStyles}>{children}</Text>
      </Text>
   );
}

const styles = StyleSheet.create({
   base: {
      textAlign: 'center',
      overflow: 'hidden',
      borderRadius: BorderRadius.full,
      alignSelf: 'flex-start',
   },

   //variant
   default: {
      backgroundColor: Colors.backgroundTertiary,
   },
   success: {
      backgroundColor: Colors.successLight,
   },
   error: {
      backgroundColor: Colors.errorLight,
   },
   warning: {
      backgroundColor: Colors.warningLight,
   },
   info: {
      backgroundColor: Colors.infoLight,
   },

   //tailles
   sm: {
      paddingHorizontal: Spacing.xs,
      paddingVertical: 2,
   },
   md: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
   },
   lg: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
   },

   //styles texte
   text: {
      fontWeight: Typography.fontWeight.medium,
   },
   defaultText: {
      color: Colors.textSecondary,
   },
   successText: {
      color: Colors.success,
   },
   errorText: {
      color: Colors.error,
   },
   warningText: {
      color: Colors.warning,
   },
   infoText: {
      color: Colors.info,
   },

   //tailles de texte
   smText: {
      fontSize: Typography.fontSize.xs,
   },
   mdText: {
      fontSize: Typography.fontSize.sm,
   },
   lgText: {
      fontSize: Typography.fontSize.base,
   },
});
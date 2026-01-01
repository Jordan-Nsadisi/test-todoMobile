import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/src/utils/designSystem';
import React from 'react';
import {
   ActivityIndicator,
   StyleSheet,
   Text,
   TextStyle,
   TouchableOpacity,
   TouchableOpacityProps,
   ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
   children: React.ReactNode;
   variant?: ButtonVariant;
   size?: ButtonSize;
   loading?: boolean;
   disabled?: boolean;
   fullWidth?: boolean;
   style?: ViewStyle;
   textStyle?: TextStyle;
}

export function Button({
   children,
   variant = 'primary',
   size = 'md',
   loading = false,
   disabled = false,
   fullWidth = false,
   style,
   textStyle,
   onPress,
   ...props
}: ButtonProps) {
   const buttonStyles = [
      styles.base,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      style,
   ];

   const textStyles = [
      styles.text,
      styles[`${variant}Text`],
      styles[`${size}Text`],
      disabled && styles.disabledText,
      textStyle,
   ];

   return (
      <TouchableOpacity
         style={buttonStyles}
         onPress={onPress}
         disabled={disabled || loading}
         activeOpacity={0.7}
         {...props}
      >
         {loading ? (
            <ActivityIndicator
               size={size === 'sm' ? 'small' : 'small'}
               color={variant === 'primary' ? Colors.textLight : Colors.primary}
            />
         ) : (
            <Text style={textStyles}>{children}</Text>
         )}
      </TouchableOpacity>
   );
}

const styles = StyleSheet.create({
   //styles de base
   base: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.lg,
      minHeight: 44, // iOS/Android recommended minimum touch target
      flexDirection: 'row',
      ...Shadows.sm,
   },

   //variants
   primary: {
      backgroundColor: Colors.primary,
      borderWidth: 1,
      borderColor: Colors.primary,
   },
   outline: {
      backgroundColor: Colors.transparent,
      borderWidth: 1,
      borderColor: Colors.border,
   },
   ghost: {
      backgroundColor: Colors.transparent,
      borderWidth: 0,
   },

   // tailles
   sm: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      minHeight: 36,
   },
   md: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
   },
   lg: {
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      minHeight: 52,
   },

   //états
   disabled: {
      opacity: 0.5,
   },
   fullWidth: {
      width: '100%',
   },

   // styles textes
   text: {
      fontWeight: Typography.fontWeight.medium,
      textAlign: 'center',
   },
   primaryText: {
      color: Colors.textLight,
      fontSize: Typography.fontSize.base,
   },
   outlineText: {
      color: Colors.primary,
      fontSize: Typography.fontSize.base,
   },
   ghostText: {
      color: Colors.primary,
      fontSize: Typography.fontSize.base,
   },
   disabledText: {
      opacity: 0.7,
   },

   //tailles de textes
   smText: {
      fontSize: Typography.fontSize.sm,
   },
   mdText: {
      fontSize: Typography.fontSize.base,
   },
   lgText: {
      fontSize: Typography.fontSize.lg,
   },
});
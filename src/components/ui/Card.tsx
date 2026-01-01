import { BorderRadius, Colors, Shadows, Spacing } from '@/src/utils/designSystem';
import React from 'react';
import {
   StyleSheet,
   TouchableOpacity,
   TouchableOpacityProps,
   View,
   ViewStyle,
} from 'react-native';

type CardVariant = 'default' | 'outlined' | 'elevated';

interface CardProps extends Omit<TouchableOpacityProps, 'style'> {
   children: React.ReactNode;
   variant?: CardVariant;
   padding?: keyof typeof Spacing;
   margin?: keyof typeof Spacing;
   pressable?: boolean;
   style?: ViewStyle;
}

export function Card({
   children,
   variant = 'default',
   padding = 'lg',
   margin = 'sm',
   pressable = false,
   style,
   onPress,
   ...props
}: CardProps) {
   const cardStyles = [
      styles.base,
      styles[variant],
      {
         padding: Spacing[padding],
         margin: Spacing[margin],
      },
      style,
   ];

   //si pressable et onPress sont fournis, rendre la carte pressable
   if (pressable && onPress) {
      return (
         <TouchableOpacity
            style={cardStyles}
            onPress={onPress}
            activeOpacity={0.7}
            {...props}
         >
            {children}
         </TouchableOpacity>
      );
   }

   return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
   base: {
      borderRadius: BorderRadius.xl,
      backgroundColor: Colors.background,
   },

   //variants
   default: {
      ...Shadows.sm,
   },

   outlined: {
      borderWidth: 1,
      borderColor: Colors.border,
   },

   elevated: {
      ...Shadows.lg,
   },
});
import { BorderRadius, Colors, Spacing, Typography } from '@/src/utils/designSystem';
import React, { useState } from 'react';
import {
   StyleSheet,
   Text,
   TextInput,
   TextInputProps,
   TouchableOpacity,
   View,
   ViewStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
   label?: string;
   error?: string;
   hint?: string;
   leftIcon?: React.ReactNode;
   rightIcon?: React.ReactNode;
   showPasswordToggle?: boolean;
   containerStyle?: ViewStyle;
   required?: boolean;
}

export function Input({
   label,
   error,
   hint,
   leftIcon,
   rightIcon,
   showPasswordToggle = false,
   containerStyle,
   required = false,
   secureTextEntry,
   style,
   ...props
}: InputProps) {
   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
   const [isFocused, setIsFocused] = useState(false);

   const isSecure = showPasswordToggle ? !isPasswordVisible : secureTextEntry;

   const inputStyles = [
      styles.input,
      isFocused && styles.inputFocused,
      error && styles.inputError,
      (leftIcon || rightIcon || showPasswordToggle) && styles.inputWithIcon,
      style,
   ];

   return (
      <View style={[styles.container, containerStyle]}>
         {label && (
            <View style={styles.labelContainer}>
               <Text style={styles.label}>
                  {label}
                  {required && <Text style={styles.required}> *</Text>}
               </Text>
            </View>
         )}

         <View style={styles.inputContainer}>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

            <TextInput
               style={inputStyles}
               secureTextEntry={isSecure}
               onFocus={() => setIsFocused(true)}
               onBlur={() => setIsFocused(false)}
               placeholderTextColor={Colors.textMuted}
               {...props}
            />

            {showPasswordToggle && (
               <TouchableOpacity
                  style={styles.rightIcon}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
               >
                  <Text style={styles.passwordToggle}>
                     {isPasswordVisible ? '🙈' : '👁️'}
                  </Text>
               </TouchableOpacity>
            )}

            {rightIcon && !showPasswordToggle && (
               <View style={styles.rightIcon}>{rightIcon}</View>
            )}
         </View>

         {error && <Text style={styles.errorText}>{error}</Text>}
         {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      marginBottom: Spacing.md,
   },

   labelContainer: {
      marginBottom: Spacing.xs,
   },

   label: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
      color: Colors.text,
   },

   required: {
      color: Colors.error,
   },

   inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
   },

   input: {
      flex: 1,
      height: 44,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      backgroundColor: Colors.background,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: BorderRadius.lg,
      fontSize: Typography.fontSize.base,
      color: Colors.text,
   },

   inputFocused: {
      borderColor: Colors.primary,
      backgroundColor: Colors.background,
   },

   inputError: {
      borderColor: Colors.error,
   },

   inputWithIcon: {
      paddingLeft: 44,
   },

   leftIcon: {
      position: 'absolute',
      left: Spacing.md,
      zIndex: 1,
   },

   rightIcon: {
      position: 'absolute',
      right: Spacing.md,
      zIndex: 1,
   },

   passwordToggle: {
      fontSize: 16,
   },

   errorText: {
      marginTop: Spacing.xs,
      fontSize: Typography.fontSize.xs,
      color: Colors.error,
   },

   hintText: {
      marginTop: Spacing.xs,
      fontSize: Typography.fontSize.xs,
      color: Colors.textMuted,
   },
});
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/src/utils/designSystem';
import React from 'react';
import {
   KeyboardAvoidingView,
   Platform,
   Modal as RNModal,
   ModalProps as RNModalProps,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';

interface ModalProps extends Omit<RNModalProps, 'children'> {
   isVisible: boolean; //contrôle la visibilité du modal
   onClose: () => void;
   title?: string;
   children: React.ReactNode;
   showCloseButton?: boolean;
   maxHeight?: number;
}

export function Modal({
   isVisible,
   onClose,
   title,
   children,
   showCloseButton = true,
   maxHeight,
   ...props
}: ModalProps) {
   return (
      <RNModal
         visible={isVisible}
         transparent
         animationType="slide"
         onRequestClose={onClose}
         {...props}
      >
         <View style={styles.overlay}>
            <KeyboardAvoidingView
               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
               style={styles.keyboardView}
            >
               <View style={[styles.modal, maxHeight && { maxHeight }]}>
                  {/* Header */}
                  {(title || showCloseButton) && (
                     <View style={styles.header}>
                        {title && <Text style={styles.title}>{title}</Text>}
                        {showCloseButton && (
                           <TouchableOpacity
                              style={styles.closeButton}
                              onPress={onClose}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                           >
                              <Text style={styles.closeText}>✕</Text>
                           </TouchableOpacity>
                        )}
                     </View>
                  )}

                  {/* contenue */}
                  <ScrollView
                     style={styles.content}
                     showsVerticalScrollIndicator={false}
                     keyboardShouldPersistTaps="handled"
                  >
                     {children}
                  </ScrollView>
               </View>
            </KeyboardAvoidingView>
         </View>
      </RNModal>
   );
}

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      backgroundColor: Colors.overlay,
      justifyContent: 'flex-end',
   },

   keyboardView: {
      justifyContent: 'flex-end',
   },

   modal: {
      backgroundColor: Colors.background,
      borderTopLeftRadius: BorderRadius['2xl'],
      borderTopRightRadius: BorderRadius['2xl'],
      maxHeight: '90%',
      ...Shadows.lg,
   },

   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing['2xl'],
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: Colors.borderLight,
   },

   title: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.semibold,
      color: Colors.text,
      flex: 1,
   },

   closeButton: {
      width: 32,
      height: 32,
      borderRadius: BorderRadius.full,
      backgroundColor: Colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
   },

   closeText: {
      fontSize: Typography.fontSize.lg,
      color: Colors.textSecondary,
      fontWeight: Typography.fontWeight.medium,
   },

   content: {
      paddingHorizontal: Spacing['2xl'],
      paddingVertical: Spacing.lg,
   },
});
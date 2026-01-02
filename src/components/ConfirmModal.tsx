import { Button, Modal } from '@/src/components/ui';
import { Colors, Spacing, Typography } from '@/src/utils/designSystem';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ConfirmModalProps {
   isVisible: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   message: string;
   confirmText?: string;
   cancelText?: string;
   confirmVariant?: 'primary' | 'danger';
   isLoading?: boolean;
}

export function ConfirmModal({
   isVisible,
   onClose,
   onConfirm,
   title,
   message,
   confirmText = 'Confirmer',
   cancelText = 'Annuler',
   confirmVariant = 'primary',
   isLoading = false,
}: ConfirmModalProps) {
   const handleConfirm = () => {
      onConfirm();
      onClose();
   };

   return (
      <Modal
         isVisible={isVisible}
         onClose={onClose}
         title={title}
         maxHeight={300}
      >
         <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.actions}>
               <Button
                  variant="outline"
                  onPress={onClose}
                  disabled={isLoading}
                  style={styles.button}
               >
                  {cancelText}
               </Button>

               <Button
                  variant={confirmVariant === 'danger' ? 'outline' : 'primary'}
                  onPress={handleConfirm}
                  disabled={isLoading}
                  loading={isLoading}
                  style={[
                     styles.button,
                     confirmVariant === 'danger' && styles.dangerButton,
                  ]}
               >
                  <Text
                     style={[
                        confirmVariant === 'danger' && styles.dangerButtonText,
                     ]}
                  >
                     {confirmText}
                  </Text>
               </Button>
            </View>
         </View>
      </Modal>
   );
}

const styles = StyleSheet.create({
   container: {
      paddingVertical: Spacing.md,
   },

   message: {
      fontSize: Typography.fontSize.base,
      color: Colors.text,
      lineHeight: Typography.lineHeight.relaxed,
      marginBottom: Spacing.xl,
   },

   actions: {
      flexDirection: 'row',
      gap: Spacing.md,
      paddingTop: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: Colors.borderLight,
   },

   button: {
      flex: 1,
   },

   dangerButton: {
      borderColor: Colors.error,
      backgroundColor: Colors.errorLight,
   },

   dangerButtonText: {
      color: Colors.error,
      fontWeight: Typography.fontWeight.medium,
   },
});
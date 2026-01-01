import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { StyleSheet, View } from 'react-native';

export default function DashboardScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Mes Tâches</ThemedText>
      </ThemedView>

      <View style={styles.content}>
        <ThemedText type="subtitle">Dashboard en construction...</ThemedText>
        <ThemedText>
          Cette page affichera la liste des tâches une fois l'authentification implémentée.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});


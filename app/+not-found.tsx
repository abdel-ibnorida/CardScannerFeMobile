import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function NotFound() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 - Pagina non trovata</Text>
      <Text style={styles.message}>Spiacenti, la pagina che cerchi non esiste.</Text>
      <Button title="Torna alla Home" onPress={() => router.push('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  message: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
});

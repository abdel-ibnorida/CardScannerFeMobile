// components/LoginModal.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

export default function LoginModal({ visible, onDismiss }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await login(email.trim(), password);
    setLoading(false);
    if (error) {
      setError(error.message || 'Errore login');
      return;
    }
    // chiudi modal su successo
    onDismiss();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Accedi</Text>
          {!!error && <Text style={styles.error}>{error}</Text>}
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
          <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
          {loading ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.row}>
              <Button title="Annulla" onPress={onDismiss} />
              <Button title="Accedi" onPress={handleLogin} />
            </View>
          )}

          <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { onDismiss(); router.push('/auth/login'); }}>
            <Text style={{ color: '#007AFF', textAlign: 'center' }}>Vai alla schermata di login completa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '85%', backgroundColor: 'white', padding: 20, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  error: { color: 'red', marginBottom: 8 },
});

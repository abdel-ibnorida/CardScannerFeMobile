// app/auth/login.tsx
import { useRouter, useSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const router = useRouter();
  const { redirectTo } = useSearchParams<{ redirectTo?: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    setLoading(true);
    const { error } = await login(email.trim(), password);
    setLoading(false);
    if (error) return Alert.alert('Errore', error.message || 'Login fallito');
    // dopo login, torna alla pagina di destinazione se presente
    if (redirectTo) {
      router.replace(redirectTo);
    } else {
      router.replace('/tabs'); // o la tua home tab
    }
  };

  const doRegister = async () => {
    setLoading(true);
    const { error } = await register(email.trim(), password);
    setLoading(false);
    if (error) return Alert.alert('Errore', error.message || 'Registrazione fallita');
    Alert.alert('Registrazione iniziata', 'Controlla la tua email per confermare (se richiesto).');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accedi</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Accedi" onPress={doLogin} disabled={loading} />
      <View style={{ height: 10 }} />
      <Button title="Registrati" onPress={doRegister} disabled={loading} />
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: '#666' }}>Se hai bisogno di opzioni avanzate usa la pagina Profile o contatta il supporto.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  input: { borderBottomWidth: 1, marginBottom: 12, paddingVertical: 8 },
});

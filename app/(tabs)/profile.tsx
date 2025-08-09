import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, signIn, signUp, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async () => {
    if (isRegister) {
      const { error } = await signUp(email, password);
      if (error) Alert.alert('Errore registrazione', error.message);
      else Alert.alert('Registrazione avvenuta, controlla la mail');
    } else {
      const { error } = await signIn(email, password);
      if (error) Alert.alert('Errore login', error.message);
      else Alert.alert('Login avvenuto');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {user ? (
        <>
          <Text>Benvenuto {user.email}</Text>
          <Button title="Logout" onPress={signOut} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={{ marginBottom: 10, borderBottomWidth: 1 }}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{ marginBottom: 10, borderBottomWidth: 1 }}
          />
          <Button title={isRegister ? 'Registrati' : 'Accedi'} onPress={handleAuth} />
          <Button
            title={isRegister ? 'Hai già un account? Accedi' : "Non hai un account? Registrati"}
            onPress={() => setIsRegister(!isRegister)}
          />
        </>
      )}
    </View>
  );
}

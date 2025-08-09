// app/tabs/archivio.tsx
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import LoginModal from '../../components/LoginModal';
import { useAuth } from '../../context/AuthContext';

export default function Archivio() {
  const { user } = useAuth();
  const [loginVisible, setLoginVisible] = useState(false);

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ marginBottom: 10 }}>Devi accedere per vedere l'archivio.</Text>
        <Button title="Accedi" onPress={() => setLoginVisible(true)} />
        <LoginModal visible={loginVisible} onDismiss={() => setLoginVisible(false)} />
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Qui va il contenuto dell'archivio per l'utente loggato</Text>
    </View>
  );
}

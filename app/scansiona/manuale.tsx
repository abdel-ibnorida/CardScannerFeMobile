import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ManualScreen() {
  const router = useRouter();

  const [id, setId] = useState('89943723');
  const [espansione, setEspansione] = useState('DUPO');
  const [lingua, setLingua] = useState('ita');
  const [primaEdizione, setPrimaEdizione] = useState('no'); // ✅ "no" come default
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<null | {
    name: string;
    nomeIta: string;
    set_name: string;
    set_code: string;
    image_url: string | null;
    cardmarket_price: string | null;
    rarity: string;
    inGoat: boolean;
    inEdison: boolean;
    numero_ristampe: string;
    cardmarket_scrap_price: string;
  }>(null);

  const validateInputs = () => {
    const isNumeric = /^\d+$/.test(id);
    const isEspansioneValid = /^[A-Za-z0-9]{3,4}$/.test(espansione);

    if (!isNumeric) {
      Alert.alert('Errore', 'ID deve contenere solo numeri.');
      return false;
    }

    if (!isEspansioneValid) {
      Alert.alert('Errore', 'Espansione deve contenere 3 o 4 caratteri alfanumerici.');
      return false;
    }

    return true;
  };

  const goToResult = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://192.168.1.6:3000/api/invia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          espansione,
          lingua,
          primaEdizione: primaEdizione === 'si', // ✅ converti in boolean
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        router.push({
          pathname: '/resultWeb',
          params: {
            imageUrl: data.image_url || '',
            name: data.name || '',
            nomeIta: data.nomeIta || '',
            nomeset: data.set_name || 'n/a',
            periodo: data.periodo || 'n/a',
            prezzo_cm_genrico: data.cardmarket_price || 'N/A',
            inGoat: data.inGoat,
            inEdison: data.inEdison,
            rarity: data.rarity,
            numero_ristampe: data.numero_ristampe,
            cardmarket_scrap_price: data.cardmarket_scrap_price
          },
        });
      } else {
        Alert.alert('Errore', data.message || 'Errore nel backend');
      }
    } catch (error) {
      Alert.alert('Errore', 'Errore di connessione al server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="ID (solo numeri)"
        keyboardType="numeric"
        value={id}
        onChangeText={setId}
        style={styles.input}
      />

      <TextInput
        placeholder="Espansione (3-4 caratteri alfanumerici)"
        value={espansione}
        onChangeText={setEspansione}
        style={styles.input}
        maxLength={4}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Lingua:</Text>
      <Picker
        selectedValue={lingua}
        style={styles.picker}
        onValueChange={(itemValue) => setLingua(itemValue)}
      >
        <Picker.Item label="Italiano" value="it" />
        <Picker.Item label="Inglese" value="en" />
        <Picker.Item label="Spagnolo" value="es" />
        <Picker.Item label="Francese" value="fr" />
        <Picker.Item label="Tedesco" value="de" />
        <Picker.Item label="Giapponese" value="jo" />
      </Picker>

      <Text style={styles.label}>Prima edizione:</Text>
      <Picker
        selectedValue={primaEdizione}
        style={styles.picker}
        onValueChange={(itemValue) => setPrimaEdizione(itemValue)}
      >
        <Picker.Item label="No" value="no" />
        <Picker.Item label="Sì" value="si" />
      </Picker>

      <Button
        title={loading ? 'Caricamento...' : 'Invia dati'}
        onPress={goToResult}
        disabled={loading}
      />

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>{result.name}</Text>
          <Text style={styles.resultTitle}>{result.nomeIta}</Text>
          <Text>Set Name: {result.set_name}</Text>
          <Text>Set Code: {result.set_code}</Text>
          <Text>Prezzo: € {result.cardmarket_price || 'N/A'}</Text>
          {result.image_url ? (
            <Image source={{ uri: result.image_url }} style={styles.image} resizeMode="contain" />
          ) : (
            <Text>Nessuna immagine disponibile</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'stretch',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  resultContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  image: {
    width: 250,
    height: 350,
    marginTop: 10,
    borderRadius: 8,
  },
});

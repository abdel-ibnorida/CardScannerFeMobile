import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
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

export default function ResultScreen() {
  const {
    imageUrl,
    name,
    nomeIta,
    nomeset,
    rarity,
    prezzo_cm_genrico,
    numero_ristampe,
    inGoat,
    inEdison,
    cardmarket_scrap_price
  } = useLocalSearchParams();

  const [added, setAdded] = useState(false);
  const [quantita, setQuantita] = useState('1'); // gestita come stringa
  const [condizioni, setCondizioni] = useState<string[]>(['Excellent']);

  const inGoatBool = inGoat === 'true';
  const inEdisonBool = inEdison === 'true';

  const condizioniPossibili = [
    'Mint',
    'Near Mint',
    'Excellent',
    'Good',
    'Light Played',
    'Played',
    'Poor',
  ];

  const handleAddToCollection = () => {
    const carteDaAggiungere = condizioni.map(cond => ({
      nome: name,
      nomeIta: nomeIta,
      set: nomeset,
      rarita: rarity,
      prezzo: prezzo_cm_genrico,
      condizione: cond,
      inGoat: inGoatBool,
      inEdison: inEdisonBool,
      cardmarket_scrap_price: cardmarket_scrap_price,
    }));

    // Esempio: invio al backend
    // await fetch('/api/add', { method: 'POST', body: JSON.stringify(carteDaAggiungere) })

    setAdded(true);
    Alert.alert('Successo', 'Carte aggiunte alla collezione!');
  };

  const handleQuantitaChange = (text: string) => {
    setQuantita(text); // aggiorna il campo input

    const n = parseInt(text);
    if (!isNaN(n) && n > 0) {
      setCondizioni(Array(n).fill('Excellent'));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text>Nessuna immagine disponibile</Text>
      )}

      <Text style={styles.title}>{name}</Text>
      <Text style={styles.title}>{nomeIta}</Text>
      <Text>Nome set: {nomeset}</Text>
      <Text>Goat: {inGoatBool ? 'Sì' : 'No'}</Text>
      <Text>Edison: {inEdisonBool ? 'Sì' : 'No'}</Text>
      <Text>Prezzo_cm_generico: {prezzo_cm_genrico} Prezzo_preciso: {cardmarket_scrap_price}</Text>
      <Text>Rarità: {rarity}</Text>
      <Text>Numero ristampe: {numero_ristampe}</Text>
      
      <Text style={styles.label}>Numero copie:</Text>
      <TextInput
        keyboardType="numeric"
        value={quantita}
        onChangeText={handleQuantitaChange}
        style={styles.input}
      />

      <Text style={styles.label}>Condizione per ogni copia:</Text>
      {condizioni.map((condizione, index) => (
        <View key={index} style={styles.conditionRow}>
          <Text>Copia {index + 1}:</Text>
          <Picker
            selectedValue={condizione}
            style={styles.picker}
            onValueChange={(itemValue) => {
              const nuove = [...condizioni];
              nuove[index] = itemValue;
              setCondizioni(nuove);
            }}
          >
            {condizioniPossibili.map(opt => (
              <Picker.Item key={opt} label={opt} value={opt} />
            ))}
          </Picker>
        </View>
      ))}

      <Button
        title={added ? 'Carte aggiunte' : 'Aggiungi alla collezione'}
        onPress={handleAddToCollection}
        disabled={added}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  image: { width: 200, height: 300, marginBottom: 20, resizeMode: 'contain' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '80%',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  label: { fontWeight: 'bold', marginTop: 20, marginBottom: 5 },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  picker: {
    height: 50,
    width: 160,
  },
});

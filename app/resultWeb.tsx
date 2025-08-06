import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';



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
  const [open, setOpen] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [playlistOptions, setPlaylistOptions] = useState([
    { label: 'Archetipo EROE', value: 'archetipo-eroe' },
    { label: 'Fusion Deck', value: 'fusion-deck' },
    { label: 'Preferite', value: 'preferite' },
  ]);
  const condizioniPossibili = [
    'Mint',
    'Near Mint',
    'Excellent',
    'Good',
    'Light Played',
    'Played',
    'Poor',
  ];
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

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
    <>
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
        <Text style={styles.label}>Playlist di destinazione:</Text>
        <View style={styles.playlistRow}>
          <View style={{ flex: 1, zIndex: open ? 1000 : 1 }}>
            <DropDownPicker
              listMode="SCROLLVIEW"
              multiple={true}
              open={open}
              value={selectedPlaylists}
              items={playlistOptions}
              setOpen={setOpen}
              setValue={setSelectedPlaylists}
              setItems={setPlaylistOptions}
              searchable={true}
              placeholder="Seleziona una o più playlist"
              style={styles.dropdown}
              dropDownContainerStyle={{
                zIndex: 1000,
                elevation: 1000, // Android
              }}
            />
          </View>

          <Pressable
            onPress={() => setModalVisible(true)}
            style={styles.inlineAdd}
          >
            <Text style={styles.inlineAddText}>➕</Text>
          </Pressable>
        </View>


        <Button
          title={added ? 'Carte aggiunte' : 'Aggiungi alla collezione'}
          onPress={handleAddToCollection}
          disabled={added}
        />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.label}>Nome nuova playlist:</Text>
            <TextInput
              style={styles.input}
              placeholder="Inserisci nome"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button title="Annulla" onPress={() => setModalVisible(false)} />
              <Button
                title="Crea"
                onPress={() => {
                  if (newPlaylistName.trim() === '') return;

                  const value = newPlaylistName.trim().toLowerCase().replace(/\s+/g, '-');
                  const label = newPlaylistName.trim();

                  setPlaylistOptions(prev => [...prev, { label, value }]);
                  setSelectedPlaylists(prev => [...prev, value]);
                  setNewPlaylistName('');
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

    </>

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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  }, playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    gap: 8,
  },

  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50, // 👈 larghezza fissa per evitare overflow
  },

  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playlistRowModern: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
  },

  dropdownWithButton: {
    borderRadius: 8,
    paddingRight: 50, // spazio per l'icona
  },

  inlineAdd: {
    position: 'absolute',
    right: 10,
    top: 12,
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inlineAddText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    borderRadius: 8,
  },

  newPlaylistButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  newPlaylistButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    zIndex: 1000, // importante!
  },

  dropdown: {
    borderRadius: 8,
  },

  inlineAdd: {
    width: 40,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    zIndex: 1001, // 👈 deve essere maggiore del dropdown
    elevation: 1001, // 👈 per Android
  },

  inlineAddText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },


});

import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePhoto } from '../context/PhotoContext.js';

export default function ResultFoto() {
  const { photos, info } = usePhoto();
  const router = useRouter();
  
  const savePhotos = async () => {
    if (!photos || photos.length === 0) return;
    
    try {
      // Richiedi permessi per salvare nella galleria
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permesso negato',
          'Non posso salvare le foto senza il permesso di accesso alla galleria'
        );
        return;
      }

      // Salva ogni foto
      const savedPhotos = [];
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        savedPhotos.push(asset);
        console.log(`Foto ${i + 1} salvata:`, asset.uri);
      }

      // Mostra conferma
      Alert.alert(
        'Foto salvate!',
        `${savedPhotos.length} foto salvata${savedPhotos.length > 1 ? 'e' : ''} nella galleria`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Errore nel salvare le foto:', error);
      Alert.alert('Errore', 'Impossibile salvare le foto nella galleria');
    }
  };
  
  const goToResult = () => {
    router.push({
      pathname: '/resultWeb',
      params: {
        imageUrl: 'https://placekitten.com/300/400',
        name: 'Carta Manuale',
        periodo: 'Edision',
        prezzo: '€10',
      },
    });
  };

  if (!photos || photos.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Nessuna foto disponibile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header fisso */}
      <View style={styles.header}>
        <Text style={styles.title}>{info.name}</Text>
        <Text style={styles.subtitle}>
          {photos.length} foto scattata{photos.length > 1 ? 'e' : ''}
        </Text>
      </View>

      {/* Area scrollabile per le foto */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoContainer}>
            <Text style={styles.photoLabel}>Foto {index + 1}</Text>
            <Image
              source={{ uri: photo.uri }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>

      {/* Bottoni fissi in basso */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={savePhotos}>
          <Text style={styles.saveButtonText}>💾 Salva Foto</Text>
        </TouchableOpacity>
        
        <View style={styles.buttonSpacer} />
        
        <Button title="Invia dati" onPress={goToResult} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  image: {
    width: 280,
    height: 200, // Altezza ridotta per vedere meglio entrambe le foto
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  buttonContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40, // Più spazio dal basso per evitare la navigation bar Android
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSpacer: {
    height: 12, // Spazio tra i due bottoni
  },
});
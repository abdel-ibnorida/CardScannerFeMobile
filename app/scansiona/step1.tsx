import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ScannerOneStep from '../../components/ScannerTwoSteps';

export default function Step1Screen() {
  const [images, setImages] = React.useState<{ id?: string; espansione?: string }>({});

  const handleCaptured = (data: { id: string; espansione: string }) => {
    setImages(data);
  };

  return (
    <View style={styles.container}>
      <ScannerOneStep onImagesCaptured={handleCaptured} />
      {images.id && (
        <View style={styles.resultContainer}>
          <Text style={styles.title}>ID:</Text>
          <Image source={{ uri: images.id }} style={styles.image} />
          <Text style={styles.title}>Espansione:</Text>
          <Image source={{ uri: images.espansione }} style={styles.image} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultContainer: {
    position: 'absolute',
    bottom: 120,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
  },
  image: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 6,
  },
});

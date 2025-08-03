import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ScannerTwoSteps from '../../components/ScannerTwoSteps';
import { usePhoto } from '../../context/PhotoContext.js';

export default function Step2() {
  const router = useRouter();
  const { setPhotos, setInfo } = usePhoto();

  const name = 'Scatto Step 2';
  const periodo = '2025';
  const prezzo = '€20';

  const onPhotoTaken = (croppedPhotos) => {
    setPhotos(croppedPhotos);
    setInfo({ name, periodo, prezzo });

    router.push('/resultFoto');
  };

  return (
    <View style={styles.container}>
      <ScannerTwoSteps onPhotoTaken={onPhotoTaken} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

import { CameraView, useCameraPermissions } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Dimensioni del rettangolo di scan (adatto per codici 8/9 cifre)
const SCAN_AREA_WIDTH = screenWidth * 0.6;
const SCAN_AREA_HEIGHT = 50;

export default function ScannerTwoSteps({ onPhotoTaken }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // Step 1 = prima foto, Step 2 = seconda foto
  const cameraRef = useRef(null);

  // Calcola la posizione centrale del rettangolo
  const scanAreaX = (screenWidth - SCAN_AREA_WIDTH) / 2;
  const scanAreaY = (screenHeight - SCAN_AREA_HEIGHT) / 2;

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Abbiamo bisogno del permesso per usare la fotocamera
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Concedi Permesso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    
    try {
      // Cattura la foto
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });

      // Calcola le proporzioni per il crop
      const photoAspectRatio = photo.width / photo.height;
      const screenAspectRatio = screenWidth / screenHeight;
      
      let cropX, cropY, cropWidth, cropHeight;
      
      if (photoAspectRatio > screenAspectRatio) {
        // Foto più larga dello schermo - crop orizzontalmente
        const scaledPhotoWidth = photo.height * screenAspectRatio;
        const scaleX = scaledPhotoWidth / screenWidth;
        const scaleY = photo.height / screenHeight;
        
        cropX = ((photo.width - scaledPhotoWidth) / 2) + (scanAreaX * scaleX);
        cropY = scanAreaY * scaleY;
        cropWidth = SCAN_AREA_WIDTH * scaleX;
        cropHeight = SCAN_AREA_HEIGHT * scaleY;
      } else {
        // Foto più alta dello schermo - crop verticalmente
        const scaledPhotoHeight = photo.width / screenAspectRatio;
        const scaleX = photo.width / screenWidth;
        const scaleY = scaledPhotoHeight / screenHeight;
        
        cropX = scanAreaX * scaleX;
        cropY = ((photo.height - scaledPhotoHeight) / 2) + (scanAreaY * scaleY);
        cropWidth = SCAN_AREA_WIDTH * scaleX;
        cropHeight = SCAN_AREA_HEIGHT * scaleY;
      }

      // Ritaglia l'immagine
      const croppedImage = await manipulateAsync(
        photo.uri,
        [
          {
            crop: {
              originX: Math.max(0, cropX),
              originY: Math.max(0, cropY),
              width: Math.min(cropWidth, photo.width - cropX),
              height: Math.min(cropHeight, photo.height - cropY),
            },
          },
        ],
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      // Aggiungi la foto all'array
      const updatedPhotos = [...capturedPhotos, croppedImage];
      setCapturedPhotos(updatedPhotos);

      if (currentStep === 1) {
        // Prima foto scattata, passa al secondo step
        setCurrentStep(2);
      } else {
        // Seconda foto scattata, invia entrambe le foto
        onPhotoTaken(updatedPhotos);
      }
      
    } catch (error) {
      console.error('Errore durante la cattura della foto:', error);
      Alert.alert('Errore', 'Impossibile catturare la foto. Riprova.');
    } finally {
      setIsCapturing(false);
    }
  };

  const resetScanner = () => {
    setCapturedPhotos([]);
    setCurrentStep(1);
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        mode="picture"
      >
        {/* Header con indicatore step */}
        <View style={styles.headerContainer}>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>
              Foto {currentStep} di 2
            </Text>
            {capturedPhotos.length > 0 && (
              <Text style={styles.capturedText}>
                ✓ {capturedPhotos.length} foto scattata{capturedPhotos.length > 1 ? 'e' : ''}
              </Text>
            )}
          </View>
          
          {/* Pulsante reset (solo se hai già scattato almeno una foto) */}
          {capturedPhotos.length > 0 && (
            <TouchableOpacity style={styles.resetButton} onPress={resetScanner}>
              <Text style={styles.resetButtonText}>↺</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Overlay con area di scan */}
        <View style={styles.overlay}>
          {/* Area scura sopra */}
          <View style={[styles.overlaySection, { height: scanAreaY }]} />
          
          {/* Riga centrale con area di scan */}
          <View style={styles.middleRow}>
            {/* Area scura sinistra */}
            <View style={[styles.overlaySection, { width: scanAreaX }]} />
            
            {/* Area di scan trasparente */}
            <View style={styles.scanArea}>
              <View style={[
                styles.scanFrame, 
                currentStep === 1 ? styles.scanFrameStep1 : styles.scanFrameStep2
              ]} />
            </View>
          </View>
          
          {/* Area scura sotto */}
          <View style={[styles.overlaySection, { flex: 1 }]} />
        </View>

        {/* Pulsante di cattura */}
        <View style={styles.captureContainer}>
          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
            onPress={takePicture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <View style={[
                styles.captureButtonInner,
                currentStep === 2 && styles.captureButtonInnerStep2
              ]} />
            )}
          </TouchableOpacity>
          
          <Text style={styles.captureButtonText}>
            {currentStep === 1 ? 'Scatta Prima Foto' : 'Scatta Seconda Foto'}
          </Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  stepIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stepText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  capturedText: {
    color: '#00FF00',
    fontSize: 12,
    marginTop: 2,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  overlaySection: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  middleRow: {
    flexDirection: 'row',
    height: SCAN_AREA_HEIGHT,
  },
  scanArea: {
    width: SCAN_AREA_WIDTH,
    height: SCAN_AREA_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderRadius: 8,
  },
  scanFrameStep1: {
    borderColor: '#00FF00', // Verde per la prima foto
  },
  scanFrameStep2: {
    borderColor: '#FF0000', // Rosso per la seconda foto
  },
  instructionText: {
    color: 'white',
    fontSize: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    textAlign: 'center',
  },
  captureContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  captureButtonInnerStep2: {
    backgroundColor: '#FF0000', // Rosso per il secondo scatto
  },
  captureButtonText: {
    color: 'white',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
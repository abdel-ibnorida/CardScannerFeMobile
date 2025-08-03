import { useRouter } from 'expo-router';
import { Button, StyleSheet, View } from 'react-native';

export default function Scansiona() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button title="Scansione 1-step" onPress={() => router.push('/scansiona/step1')} />
      <Button title="Scansione 2-step" onPress={() => router.push('/scansiona/step2')} />
      <Button title="Inserimento manuale" onPress={() => router.push('/scansiona/manuale')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-evenly', padding: 20 },
});

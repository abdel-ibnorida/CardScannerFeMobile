import { StyleSheet, Text, View } from 'react-native';

export default function Archivio() {
  return (
    <View style={styles.container}>
      <Text>Archivio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

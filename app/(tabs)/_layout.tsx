import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="scansiona"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'scansiona') {
            iconName = 'camera-outline';
          } else if (route.name === 'archivio') {
            iconName = 'albums-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="scansiona"
        options={{ title: 'Scansiona' }}
      />
      <Tabs.Screen
        name="archivio"
        options={{ title: 'Archivio' }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
}

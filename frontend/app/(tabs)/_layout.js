import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown : false,
        tabBarActiveTintColor: '#8A2BE2', 
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { 
          height: 65, 
          paddingBottom: 10,
          backgroundColor: '#ffffff' 
        },
        headerStyle: { backgroundColor: '#8A2BE2' },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan items',
          tabBarIcon: ({ color }) => <Ionicons name="shirt" size={24} color={color} />,
        }}
        />

      <Tabs.Screen
        name="outfits"
        options={{
          title: 'Outfits',
          tabBarIcon: ({ color }) => <Ionicons name="sparkles-outline" size={24} color={color} />,
        }}
        />

      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color }) => <Ionicons name="book-outline" size={24} color={color} />,
        }}
      />
     
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
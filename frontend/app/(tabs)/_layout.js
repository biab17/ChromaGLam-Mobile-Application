import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Platform, StyleSheet, View } from 'react-native';



export default function TabsLayout() {
  return (
    <Tabs
    screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#8A2BE2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: Platform.OS === 'android' ? 80 : 65, 
          paddingBottom: Platform.OS === 'android' ? 35 : 10,
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 5,
        },
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


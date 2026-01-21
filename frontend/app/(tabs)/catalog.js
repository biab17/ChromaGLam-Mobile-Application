import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

export default function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await fetch('http://172.20.10.4:4000/api/items', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert("Error", "Could not load your wardrobe.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchItems(); }, []));

  const handleToggle = async (id, currentStatus) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const newStatus = !currentStatus;

      const response = await fetch(`http://172.20.10.4:4000/api/items/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ available: newStatus })
      });

      if (response.ok) {
        setItems(prev => prev.map(item => item.id === id ? { ...item, available: newStatus } : item));
      } else {
        Alert.alert("Error", "Failed to update status on server.");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Check if the server is running.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageURL }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{item.name || "Unnamed Item"}</Text>
        <Text style={styles.styleLabel}>{item.style || "No Style"}</Text>
        
        <TouchableOpacity 
          style={[styles.statusButton, { backgroundColor: item.available ? '#4CAF50' : '#F44336' }]} 
          onPress={() => handleToggle(item.id, item.available)}
        >
          <Text style={styles.statusText}>
            {item.available ? "Available" : "Unavailable"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#5f3fd8" />
      <Text style={{ marginTop: 10, color: '#5f3fd8' }}>Loading collection...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Catalog</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()} 
        numColumns={2}
        contentContainerStyle={styles.scrollList} 
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: '800', marginTop: 60, marginBottom: 20, textAlign: 'center', color: '#333' },
  scrollList: { paddingBottom: 100 }, 
  card: { flex: 0.5, margin: 8, backgroundColor: '#fff', borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, overflow: 'hidden' },
  image: { width: '100%', height: 160, resizeMode: 'cover' },
  content: { padding: 12, alignItems: 'center' },
  name: { fontSize: 14, fontWeight: '700', color: '#333' },
  styleLabel: { fontSize: 12, color: '#888', marginBottom: 10 },
  statusButton: { width: '100%', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});
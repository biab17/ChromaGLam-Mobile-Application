import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../src/api/client'; 

export default function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/items'); 
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch Error:", error.message);
      Alert.alert("Error", "Could not load your wardrobe. Check server IP.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchItems(); }, []));

  const handleToggle = async (itemId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const response = await api.patch(`/items/${itemId}/toggle`, {
        available: newStatus
      });

      if (response.status === 200) {
        setItems(prev => prev.map(item => 
          item.item_id === itemId ? { ...item, available: newStatus } : item
        ));
      }
    } catch (error) {
      console.error("Toggle Error:", error.message);
      Alert.alert("Error", "Failed to update status on server.");
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
          onPress={() => handleToggle(item.item_id, item.available)}
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
        keyExtractor={(item) => item.item_id.toString()} 
        numColumns={2}
        contentContainerStyle={styles.scrollList} 
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'android' ? 70 : 0 
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: '800', marginTop: 60, marginBottom: 20, textAlign: 'center', color: '#333' },
  scrollList: { paddingBottom: 120 }, 
  card: { flex: 0.5, margin: 8, backgroundColor: '#fff', borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, overflow: 'hidden' },
  image: { width: '100%', height: 160, resizeMode: 'cover' },
  content: { padding: 12, alignItems: 'center' },
  name: { fontSize: 14, fontWeight: '700', color: '#333' },
  styleLabel: { fontSize: 12, color: '#888', marginBottom: 10 },
  statusButton: { width: '100%', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});
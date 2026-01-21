import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export default function ScanScreen() {
  const [loading, setLoading] = useState(false);

  const uploadImage = async (imageUri) => {
    setLoading(true);
    
    try {
      const token = await SecureStore.getItemAsync('userToken');

      if (!token) {
        Alert.alert("Eroare", "Sesiune expirată. Loghează-te din nou.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'clothing_item.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch('http://172.20.10.4:4000/api/items/add', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        Alert.alert("Success", "item uploaded!");
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Error while saving ");
      }

    } catch (error) {
      Alert.alert("Eroare No conexion", "Verify if the server is on.");
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission Denied", "Camera access is needed.");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.6 });
    if (!result.canceled) await uploadImage(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.6 });
    if (!result.canceled) await uploadImage(result.assets[0].uri);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Item</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Analizăm haina cu AI...</Text>
        </View>
      ) : (
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.circleButton} onPress={takePhoto}>
            <Ionicons name="camera" size={45} color="#fff" />
            <Text style={styles.buttonLabel}>Take Photo</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={[styles.circleButton, { backgroundColor: '#4a00b0' }]} onPress={pickFromGallery}>
            <Ionicons name="images" size={45} color="#fff" />
            <Text style={styles.buttonLabel}>Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 50, color: '#333' },
  buttonWrapper: { alignItems: 'center', width: '100%' },
  circleButton: { backgroundColor: '#6200ee', width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', elevation: 10 },
  buttonLabel: { color: '#fff', marginTop: 8, fontWeight: 'bold', fontSize: 14 },
  divider: { height: 40 },
  loadingContainer: { alignItems: 'center' },
  loadingText: { marginTop: 15, fontSize: 16, color: '#6200ee', fontWeight: '600' }
});
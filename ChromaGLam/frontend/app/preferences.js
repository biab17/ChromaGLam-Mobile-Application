import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import api from "../src/api/client";

export default function PreferencesForm() {
  const router = useRouter();
  const { userId, isUpdate } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    style: '',
    preferredColors: '',
    avoidedColors: '',
    thermalComfort: '',
    height: '',
    proportions: ''
  });

  useEffect(() => {
    if (isUpdate === "true") {
      loadCurrentPreferences();
    }
  }, [isUpdate]);

  const loadCurrentPreferences = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/me");
      if (response.data.preference) {
        const p = response.data.preference;
        setForm({
          style: p.style || '',
          preferredColors: p.preferredColors?.join(', ') || '',
          avoidedColors: p.avoidedColors?.join(', ') || '',
          thermalComfort: p.thermalComfort || '',
          height: p.height?.toString() || '',
          proportions: p.proportions || ''
        });
      }
    } catch (err) {
      console.log("Could not load existing preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.style || !form.height) {
      Alert.alert("Error", "Style and Height are required!");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      const payload = {
        style: form.style,
        thermalComfort: form.thermalComfort,
        height: parseFloat(form.height),
        proportions: form.proportions,
        preferredColors: form.preferredColors ? form.preferredColors.split(',').map(c => c.trim()) : [],
        avoidedColors: form.avoidedColors ? form.avoidedColors.split(',').map(c => c.trim()) : [],
        userId: parseInt(userId)
      };

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await api.post("/preferences", payload, { headers });

      Alert.alert("Success", "Preferences saved successfully!");

      if (isUpdate === "true") {
        router.back(); 
      } else 
        router.replace("/login"); 
      
    } catch (err) {
      Alert.alert("Error", "Could not save preferences. Please check your connection.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {isUpdate === "true" ? "Update Your Style" : "Personalize Your Experience"}
        </Text>
        
        <Text style={styles.label}>Preferred clothing style (e.g., Casual, Elegant)</Text>
        <TextInput 
          style={styles.input} 
          value={form.style} 
          onChangeText={(t) => setForm({...form, style: t})} 
          placeholder="e.g., Minimalist" 
        />

        <Text style={styles.label}>Preferred colors (separate by comma)</Text>
        <TextInput 
          style={styles.input} 
          value={form.preferredColors} 
          onChangeText={(t) => setForm({...form, preferredColors: t})} 
          placeholder="black, white, navy..." 
        />

        <Text style={styles.label}>Colors to avoid (separate by comma)</Text>
        <TextInput 
          style={styles.input} 
          value={form.avoidedColors} 
          onChangeText={(t) => setForm({...form, avoidedColors: t})} 
          placeholder="neon, bright yellow..." 
        />

        <Text style={styles.label}>Thermal Comfort (Cold, Balanced, Warm)</Text>
        <TextInput 
          style={styles.input} 
          value={form.thermalComfort} 
          onChangeText={(t) => setForm({...form, thermalComfort: t})} 
          placeholder="Balanced" 
        />

        <Text style={styles.label}>Height in cm</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={form.height} 
          onChangeText={(t) => setForm({...form, height: t})} 
          placeholder="180" 
        />

        <Text style={styles.label}>Body Proportions (e.g., Athletic, Slim)</Text>
        <TextInput 
          style={styles.input} 
          value={form.proportions} 
          onChangeText={(t) => setForm({...form, proportions: t})} 
          placeholder="Regular fit" 
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {isUpdate === "true" ? "Save Changes" : "Finish Registration"}
          </Text>
        </TouchableOpacity>

        {isUpdate === "true" && (
          <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Cancel</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 30, 
    paddingBottom: 60, 
    backgroundColor: '#5f3fd8', 
    flexGrow: 1, 
    justifyContent: 'center' 
  },
  title: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: '800', 
    marginBottom: 30, 
    textAlign: 'center', 
    marginTop: 60 
  },
  label: { 
    color: '#fff', 
    marginBottom: 8, 
    fontSize: 13, 
    fontWeight: '600' 
  },
  input: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 20 
  },
  button: { 
    backgroundColor: '#fff', 
    paddingVertical: 18, 
    borderRadius: 12, 
    marginTop: 10,
    elevation: 5
  },
  buttonText: { 
    color: '#5f3fd8', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 18 
  }
});
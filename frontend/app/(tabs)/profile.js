import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import api from "../../src/api/client";

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/me");
      setUserData(response.data);
    } catch (err) {
      Alert.alert("Error", "Session expired or server error");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchProfile(); }, []));

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    router.replace("/login");
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#5f3fd8" /></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account Details</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Username</Text>
          <Text style={styles.infoValue}>{userData?.username}</Text>
          
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{userData?.name}</Text>
          
          <Text style={styles.infoLabel}>Email Address</Text>
          <Text style={styles.infoValue}>{userData?.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Text style={styles.preferenceSummary}>
          Current style: {userData?.preference?.style || "Not set"}
        </Text>
        
        <TouchableOpacity 
          style={styles.actionBtn} 
          onPress={() => router.push({ pathname: "/preferences", params: { userId: userData?.user_id, isUpdate: "true" } })}
        >
          <Text style={styles.actionText}>Update Preferences Form</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 25 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginTop: 60, marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 20 },
  infoBox: { backgroundColor: '#f5f5f5', padding: 20, borderRadius: 15 },
  infoLabel: { fontSize: 12, color: '#888', textTransform: 'uppercase', marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '600', marginBottom: 15, color: '#333' },
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  preferenceSummary: { color: '#666', marginBottom: 15 },
  actionBtn: { backgroundColor: '#5f3fd8', padding: 15, borderRadius: 12, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { marginTop: 40, padding: 15, alignItems: 'center' },
  logoutText: { color: '#FF3B30', fontWeight: 'bold' }
});
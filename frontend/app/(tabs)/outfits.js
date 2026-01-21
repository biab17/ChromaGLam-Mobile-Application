import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, Dimensions, Alert } from 'react-native';
import * as Location from "expo-location";
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');
const BASE_URL = "http://172.20.10.4:4000/api";
const WEATHER_API_KEY = "715327b45d8574f75adcd6e99f743fbf";

export default function OutfitsScreen() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const pos = await Location.getCurrentPositionAsync({});
      const wRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&appid=${WEATHER_API_KEY}`);
      const wData = await wRes.json();
      
      const token = await SecureStore.getItemAsync('userToken');
      const response = await fetch(`${BASE_URL}/outfits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ weather: { temp: Math.round(wData.main.temp), description: wData.weather[0].description } })
      });

      const result = await response.json();
      if (response.ok) setData(result);
      else Alert.alert("Error", result.error);
    } catch (e) { Alert.alert("Connection Error", "Server is down."); } 
    finally { setLoading(false); }
  };

  const renderOutfit = (items) => (
    <View style={styles.grid}>
      {items && items.map(item => (
        <Image key={item.item_id} source={{ uri: item.imageURL }} style={styles.img} />
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Outfits</Text>

      {!data && !loading && (
        <TouchableOpacity style={styles.btn} onPress={getSuggestions}>
          <Text style={styles.btnTxt}>Generate Style Suggestions</Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#6A42C2" style={{ marginTop: 50 }} />}

      {data && (
        <View style={{ width: '100%' }}>
          <Text style={styles.label}>Style Option 1</Text>
          {renderOutfit(data.outfit1)}
          
          <Text style={styles.label}>Style Option 2</Text>
          {renderOutfit(data.outfit2)}

          <TouchableOpacity onPress={getSuggestions} style={styles.retry}>
            <Text style={styles.retryTxt}>Regenerate</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 60, marginBottom: 40, textAlign: 'center' },
  btn: { backgroundColor: '#6A42C2', padding: 20, borderRadius: 15 },
  btnTxt: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  label: { fontSize: 18, fontWeight: 'bold', color: '#6A42C2', marginVertical: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  img: { width: (width - 60) / 2, height: 210, borderRadius: 15, marginBottom: 15, backgroundColor: '#f5f5f5' },
  retry: { marginTop: 20, padding: 10 },
  retryTxt: { color: '#6A42C2', textAlign: 'center', fontWeight: 'bold' }
});
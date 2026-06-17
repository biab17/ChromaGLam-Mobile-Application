import { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  Image, 
  FlatList 
} from "react-native";
import * as Location from "expo-location";
import { API_URLS } from '../../config';
import {generateWeatherTip} from '../../src/utils/weatherUtils';

export default function Home() {
  // State for weather data
  const [weather, setWeather] = useState(null);
  // State for weather tip
  const [tip, setTip] = useState("");
  // State for dashboard data
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  //State for items to validate
  const [itemsToValidate, setItemsToValidate] = useState([]);

  useEffect(() => {
    // Le apelăm pe amândouă la montarea componentei
    loadWeather();
    loadDashboard();
    loadItemsToValidate();
  }, []);

  async function loadDashboard() {
    try {
      
      const response = await fetch(`${API_URLS.BASE}/dashboard`);

      const data = await response.json();

      if (response.ok) {
        setDashboardData(data);
      } else {
        console.log("Error loading dashboard:", data);
      }
    } catch (err) {
      console.log("Network error loading dashboard:", err);
    }
  }

  async function loadItemsToValidate() {
    try {
      const response = await fetch(`${API_URLS.BASE}/api/items/validate`);
      const data = await response.json();

      if (response.ok) {
        setItemsToValidate(data);
      } else {
        console.log("Error loading items to validate:", data);
      }
    } catch (err) {
      console.log("Network error loading items to validate:", err);
    }
  }


  async function handleValidation(itemId) {
    try {
      const response = await fetch(`${API_URLS.BASE}/api/items/make-available/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if(response.ok && data.success) {
        setItemsToValidate(prev => prev.filter(item => item.item_id !== itemId));
      } else {
        console.log("Error validating item:", data);
      }
    } catch (err) {
      console.log("Network error validating item:", err);
    }
  }
  
  async function handleRejection(itemId) {
      setItemsToValidate(prev => prev.filter(item => item.item_id !== itemId));
  }

  async function loadWeather() {
    try {
      setLoading(true);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setTip("Don't have access to location. Enable GPS permissions.");
        setLoading(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({});
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_URLS.WEATHER}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        console.log("Weather API error:", data);
        setTip("Can't load the weather.");
        setLoading(false);
        return;
      }

      setWeather(data);
      setTip(generateWeatherTip(data));
    } catch (err) {
      console.log("Weather error:", err);
      setTip("Error while loading the weather.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A42C2" />
      </View>
    );
  }

 const currentDirtyItem = itemsToValidate[0];

  return (
    <View style={styles.page}>
      {/* HEADER FIX - Salutul personalizat */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {dashboardData?.userName ? `Hello, ${dashboardData.userName}!` : 'Home'}
        </Text>
      </View>

      {/* CONTINUT SCROLLABIL */}
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        
        {/* 1. WEATHER CARD */}
        {weather ? (
          <View style={styles.card}>
            <Text style={styles.city}>{weather.name}</Text>
            <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
            <Text style={styles.desc}>
              {weather.weather?.[0]?.description?.toUpperCase()}
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
             <Text style={styles.city}>Weather unavailable</Text>
             <Text style={styles.desc}>Try again later.</Text>
          </View>
        )}

        {/* 2. TIPS CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tip of the day</Text>
          <Text style={styles.tip}>{tip}</Text>
        </View>

        {/* 3. OUTFIT OF THE DAY CARD */}
        {dashboardData?.ootd && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Outfit of the Day</Text>
            <Image 
              source={{ uri: dashboardData.ootd.imageUrl }} 
              style={styles.ootdImage} 
            />
          </View>
        )}

        {/* 4. RECENTLY ADDED SECTION */}
        {dashboardData?.recentlyAdded && dashboardData.recentlyAdded.length > 0 && (
          <View style={[styles.card, { paddingRight: 0 }]}>
            <Text style={[styles.sectionTitle, { paddingRight: 20 }]}>Recently Added</Text>
            <FlatList
              horizontal
              data={dashboardData.recentlyAdded}
              keyExtractor={(item) => item.item_id.toString()}
              renderItem={({ item }) => (
                <Image 
                  source={{ uri: item.imageUrl }} 
                  style={styles.recentImage} 
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            />
          </View>
        )}

        {/* 5. CARD NOU: POZIȚIONAT ACUM ULTIMUL (Closet Refresh / Wardrobe Status) */}
        {currentDirtyItem ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🔄 Closet Refresh</Text>
            
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Image 
                source={{ uri: currentDirtyItem.imageUrl || currentDirtyItem.imageURL }} 
                style={styles.recentImage} 
              />
              <View style={{ flex: 1, marginLeft: 15, justifyContent: "space-between" }}>
                <Text style={styles.tip}>
                  You wore "<Text style={{ fontWeight: 'bold' }}>{currentDirtyItem.name}</Text>" 3 days ago. Is it clean and ready to wear again?
                </Text>
                
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <TouchableOpacity 
                    style={{ backgroundColor: "#6A42C2", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginRight: 10 }} 
                    onPress={() => handleMakeAvailable(currentDirtyItem.item_id)}
                  >
                    <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>Yes, it's clean</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{ backgroundColor: "#F0EBFB", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 }} 
                    onPress={() => handleKeepUnavailable(currentDirtyItem.item_id)}
                  >
                    <Text style={{ color: "#6A42C2", fontSize: 12, fontWeight: "600" }}>Not yet</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Wardrobe Status</Text>
            <Text style={styles.tip}>
              All your clothes are fresh, perfectly organized, and ready to make you shine today.
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F6F2FF",
  },
  header: {
    backgroundColor: "#6A42C2",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  card: {
    backgroundColor: "white",
    marginTop: 20,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  city: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 5,
  },
  temp: {
    fontSize: 40,
    fontWeight: "700",
    color: "#6A42C2",
  },
  desc: {
    fontSize: 18,
    marginTop: 5,
    color: "#555",
    textTransform: "capitalize",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#212529",
  },
  tip: {
    fontSize: 16,
    color: "#333",
  },
  ootdImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    backgroundColor: '#EAEAEA',
    resizeMode: 'cover',
  },
  recentImage: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#EAEAEA',
    resizeMode: 'cover',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
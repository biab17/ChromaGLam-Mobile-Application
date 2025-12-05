import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

const WEATHER_API_KEY = "715327b45d8574f75adcd6e99f743fbf"; 

function generateWeatherTip(weather) {
  if (!weather) return "Enjoy your day!";

  const id = weather.weather?.[0]?.id;
  const temp = weather.main?.temp;
  const wind = weather.wind?.speed;

  if (!id) return "Enjoy your day!";

  if (id >= 200 && id <= 232) return "Storm outside! Be careful and avoid staying outside.";
  if (id >= 300 && id <= 321) return "Light drizzle. A light jacket could save your day.";
  if (id >= 500 && id <= 531) return "Raining. Don't forget to get an umbrella.";
  if (id >= 600 && id <= 622) return "Snowing. Watch out for the ice and enjoy the snowflakes!";
  if (id >= 701 && id <= 781) return "Reduced visibility. Be careful when driving or walking.";

  if (id === 800) {
    if (temp >= 28) return "Very hot! Stay hydrated and avoid open spaces.";
    if (temp <= 5) return "Clear sky but cold weather. Dress warmly!";
    return "Clear sky! Perfect weather for outside activities!";
  }

  if (id >= 801 && id <= 804) return "Cloudy sky. Take a light jacket.";

  if (wind > 12) return "Strong wind. Stay away from unstable objects.";

  return "No matter the weather, enjoy every moment!";
}

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeather();
  }, []);

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

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;
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

  if (!weather) {
    return (
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Home</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.city}>Weather unavailable</Text>
          <Text style={styles.desc}>Try again later.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.tipTitle}>Tip of the day</Text>
          <Text style={styles.tip}>{tip}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>

      {/* WEATHER CARD */}
      <View style={styles.card}>
        <Text style={styles.city}>{weather.name}</Text>

        <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>

        <Text style={styles.desc}>
          {weather.weather?.[0]?.description?.toUpperCase()}
        </Text>
      </View>

      {/* TIPS CARD */}
      <View style={styles.card}>
        <Text style={styles.tipTitle}>Tip of the day</Text>
        <Text style={styles.tip}>{tip}</Text>
      </View>
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
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
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
  tipTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  tip: {
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

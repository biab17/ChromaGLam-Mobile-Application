import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,KeyboardAvoidingView,ScrollView,Platform } from "react-native";
import { useRouter } from "expo-router";
import api from "../src/api/client";
import * as SecureStore from 'expo-secure-store';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      if (response.data.token) {
          await SecureStore.setItemAsync("userToken", response.data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      Alert.alert("Success", "Logged in!");
      }
      router.replace("/home");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Login failed");
    }
  }

 return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Log In</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const purple = "#5f3fd8";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: purple,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 80,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: purple,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
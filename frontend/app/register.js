import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,KeyboardAvoidingView,ScrollView,Platform} from "react-native";
import { useRouter } from "expo-router";
import api from "../src/api/client";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    try {
      const response = await api.post("/users/register", {
        username,
        name,
        email,
        password,
      });

      Alert.alert("Success", "Account created!");
      router.replace("/login");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Registration failed");
    }
  }

   return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
      />

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
        secureTextEntry
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
       </ScrollView>
    </KeyboardAvoidingView>
  );
}

const purple = "#5f3fd8";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: purple,
    justifyContent: "center",
    paddingHorizontal: 30,
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

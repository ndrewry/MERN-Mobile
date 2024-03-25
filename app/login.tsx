import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import BackButton from "@/components/BackButton";
import axios from "axios";
import { useNavigation } from "expo-router";

const LoginScreen = () => {
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  var path = "http://10.0.2.2:5000/api/login";
  var storage = require("./tokenStorage.js");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(path, {
        login,
        password,
      });

      if (response.data.token) {
        // Login successful
        // You can store the token in AsyncStorage or Redux for future use
        storage.storeToken(response.data.token);
        Alert.alert("Success", "Login successful");
      } else {
        // Login failed
        Alert.alert("Error", response.data.error);
      }
    } catch (error) {
      console.error("Error:", error as Error);
      Alert.alert(
        "Error",
        (error as Error).message || "An error occurred. Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setLogin}
        value={login}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
        value={password}
      />
      <Button title="Login" onPress={handleLogin} />
      <BackButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  back: {
    marginTop: 20,
  },
});

export default LoginScreen;

import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Alert,
  Pressable,
} from "react-native";

import BackButton from "@/components/BackButton";
import axios from "axios";
import { useNavigation } from "expo-router";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Landing from "./landing";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation();

  var path = "http://syntax-sensei-a349ca4c0ed0.herokuapp.com/api/login";
  //var storage = require("./tokenStorage.js");
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
        //storage.storeToken(response.data.token);
        AsyncStorage.setItem("token", response.data.token);

        // TODO - Check if the user is verified
        // var uddecoded = decode(storage.retrieveToken(), { complete: true });
        console.log(response.data);

        if (response.data.verified == false) {
          navigation.navigate("unverified");
        } else {
          console.log(response.data.token);
          navigation.navigate("landing");
        }
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
      <Text style={{ fontSize: 40, color: "#2e2e2e", paddingBottom: 80, fontWeight:"bold"}}>
        Login
      </Text>
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

      <Pressable onPress={handleLogin} style={styles.buttonLogin}>
        <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>
          Login
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.buttonGoBack}
      >
        <Text style={{ color: "#fa304c", fontSize: 17, fontWeight: "bold" }}>
          Go Back
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("forgotPassword")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>
          Forgot Password?
        </Text>
      </Pressable>
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
    height: 42,
    borderColor: "gray",
    borderWidth: 1.5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  back: {
    marginTop: 20,
  },
  buttonLogin: {
    marginTop: 30,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fa304c",
  },
  buttonGoBack: {
    marginTop: 15,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#fa304c",
    borderWidth: 3,
    marginBottom: 20,
  },
});

export default LoginScreen;

import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "expo-router";

const SignupScreen = () => {
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    var path = "http://10.0.2.2:5000/api/signup";
    var storage = require("./tokenStorage.js");
    try {
      const response = await axios.post(path, {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Username: username,
        Password: password,
      });

      if (response.data.token) {
        // Signup successful
        storage.storeToken(response.data.token);
        Alert.alert("Success", "Signup successful");
      } else {
        // Signup failed
        Alert.alert("Error", response.data.error);
      }
    } catch (error) {
      console.error("Error:", error);
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
        placeholder="dfgfgd"
        onChangeText={setFirstName}
        value={firstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={setLastName}
        value={lastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
        value={password}
      />
      <Button title="Signup" onPress={handleSignup} />
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
});

export default SignupScreen;

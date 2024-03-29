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
import axios from "axios";
import { useNavigation } from "expo-router";
import BackButton from "@/components/BackButton";

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
    var path = "http://syntax-sensei-a349ca4c0ed0.herokuapp.com/api/signup";
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
        sendLink(response.data.token);
        Alert.alert("Success", "Signup successful");
        navigation.navigate("login");
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

  function sendLink(storedToken: any) {
    // Incoming: Token
    console.log("Token: " + storedToken);
    var obj1 = { token: storedToken };
    var js1 = JSON.stringify(obj1);
    var config1 = {
      method: "post",
      url: "http://10.0.2.2:5000/api/sendVerificationLink",
      headers: {
        "Content-Type": "application/json",
      },
      data: js1,
    };
    axios(config1)
      .then(function (response) {
        var res = response.data;
        if (res.error) {
        } else {
          Alert.alert(
            "Verification email sent. Please check your email to verify your account."
          );
        }
      })
      .catch(function (error) {
        console.error(error.response.data);
      });
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 25,
          color: "black",
          paddingBottom: 40,
        }}
      >
        Sign Up
      </Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
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
      <Pressable onPress={handleSignup} style={styles.buttonSignup}>
        <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>
          Sign Up
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.buttonGoBack}
      >
        <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>
          Go Back
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
    borderRadius: 30,
  },
  buttonSignup: {
    marginTop: 60,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    borderRadius: 30,
  },
  buttonGoBack: {
    marginTop: 15,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 3,
    marginBottom: 20,
    borderRadius: 30,
  },
});

export default SignupScreen;

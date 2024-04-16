import { View, Text, TextInput, Pressable } from "react-native";
import login from "./login";
import React, { useState } from "react";
import axios from "axios";
import { useNavigation } from "expo-router";
import { StyleSheet } from "react-native";

const ForgotPassword = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");

  // Conditional display
  const [SuccessMessage, SetSuccessMessage] = useState(false);
  const [FailMessage, SetFailMesage] = useState(false);
  const navigation = useNavigation();

  const HandleRecoveryRequest = async () => {
    let obj = { username: login, email: email };
    let json = JSON.stringify(obj);
    var config = {
      method: "post",
      url: "http://syntax-sensei-a349ca4c0ed0.herokuapp.com/api/requestPasswordReset",
      headers: {
        "Content-Type": "application/json",
      },
      data: json,
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        SetSuccessMessage(true);
      })
      .catch(function (error) {
        console.log(error);
        SetFailMesage(true);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40, color: "#2e2e2e", paddingBottom: 80 }}>
        Let's find your account
      </Text>
      {SuccessMessage && (
        <Text
          id="SuccessMessage"
          style={{ marginBottom: 30, fontSize: 20, color: "red" }}
        >
          Recovery successful! Please check your email.
        </Text>
      )}
      {FailMessage && (
        <Text
          id="FailMessage"
          style={{ marginBottom: 30, fontSize: 20, color: "red" }}
        >
          Uh oh something went wrong...
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setLogin}
        value={login}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />

      <Pressable onPress={HandleRecoveryRequest} style={styles.buttonLogin}>
        <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>
          Request
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
    borderRadius: 3,
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
    borderRadius: 3,
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
    borderRadius: 3,
  },
});

export default ForgotPassword;

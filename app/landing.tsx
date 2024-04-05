import { Pressable, Text, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import { View } from "@/components/Themed";
import BackButton from "@/components/BackButton";
import React from "react";
import { useNavigation } from "expo-router";

const Landing = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Pressable style={[styles.option, styles.shadowProp]}>
        <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>
          Learning C From Zero to Hero
        </Text>
        <Image
          source={require("../assets/images/clogo.png")}
          style={[styles.image, styles.shadowProp]}
          resizeMode="contain"
        />
        <View style={styles.progressBar}></View>
      </Pressable>
      <Pressable style={[styles.option, styles.shadowProp]}>
        <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>
          Build a Solid Foundation in Java
        </Text>
        <Image
          source={require("../assets/images/javalogo.png")}
          style={[styles.image, styles.shadowProp]}
          resizeMode="contain"
        />
        <View style={styles.progressBar}></View>
      </Pressable>
      <Pressable style={[styles.option, styles.shadowProp]}>
        <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>
          Bringing Web Pages to Life With JavaScript
        </Text>
        <Image
          source={require("../assets/images/jslogo.png")}
          style={[styles.image, styles.shadowProp]}
          resizeMode="contain"
        />
        <View style={styles.progressBar}></View>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("login")}>
        <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>
          Logout
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
    backgroundColor: "white",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  option: {
    width: "100%",
    height: "25%",
    backgroundColor: "lightgrey",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  image: {
    width: "50%", // Adjust the width as needed
    height: "40%", // Adjust the height as needed
    marginTop: 0,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  progressBar: {
    width: "75%",
    height: "10%",
    justifyContent: "center",
    backgroundColor: "red",
  },
});

export default Landing;

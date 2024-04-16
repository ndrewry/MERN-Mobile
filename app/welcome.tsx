import {
  Pressable,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  View,
} from "react-native";
import { Link } from "expo-router";
import React, { useState } from "react";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

const fetchFonts = {
  "BebasNeue-Regular": require("../assets/fonts/BebasNeue-Regular.ttf"),
  SweetSansProThin: require("../assets/fonts/SweetSansProThin.ttf"),
};

const Welcome = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load custom fonts
  const loadFonts = async () => {
    await Font.loadAsync(fetchFonts);
    setFontLoaded(true);
  };

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onError={(err) => console.error(err)}
        onFinish={() => setFontLoaded(true)}
      />
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/SenseiCropped.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.syntaxContainer}>
          <Text
            style={{
              fontSize: 40,
              color: "black",
              paddingBottom: 50,
              fontFamily: "BebasNeue-Regular",
            }}
          >
            S Y N T A
          </Text>
          <Image
            source={require("../assets/images/FancyX.png")}
            style={{ width: 50, height: 50, marginTop: 10 }}
            resizeMode="contain"
          />
        </View>

        <Text
          style={{
            fontSize: 20,
            color: "black",
            paddingLeft: 100,
            fontFamily: "BebasNeue-Regular",
          }}
        >
          S E N S E I
        </Text>

        <Text
          style={{
            fontSize: 13,
            color: "black",
            paddingBottom: 120,
            fontFamily: "SweetSansProThin",
          }}
        >
          Your dojo for mastering coding languages!
        </Text>

        <Link href="/signup" asChild>
          <Pressable style={styles.buttonSignup}>
            <Text style={{ color: "white", fontFamily: "SweetSansProThin" }}>
              GET STARTED
            </Text>
          </Pressable>
        </Link>

        <Link href="/login" asChild>
          <Pressable style={styles.buttonLogin}>
            <Text style={{ color: "#fa304c", fontFamily: "SweetSansProThin" }}>
              I ALREADY HAVE AN ACCOUNT
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  syntaxContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: "70%", // Adjust the width as needed
    height: 300, // Adjust the height as needed
    marginTop: 60,
  },
  buttonSignup: {
    marginTop: 60,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fa304c",
  },
  buttonLogin: {
    marginTop: 15,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fa304c",
    marginBottom: 60,
  },
});

export default Welcome;

import {
  Pressable,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  View,
} from "react-native";
import { Link } from "expo-router";
//import { View } from "@/components/Themed";

const Welcome = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/SenseiCropped.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.syntaxContainer}>
          <Text style={{ fontSize: 40, color: "black", paddingBottom: 50 }}>
            SYNTA
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
          }}
        >
          SENSEI
        </Text>

        <Text
          style={{
            fontSize: 10.5,
            color: "black",
            paddingBottom: 120,
          }}
        >
          Your dojo for mastering coding languages!
        </Text>

        <Link href="/signup" asChild>
          <Pressable style={styles.buttonSignup}>
            <Text style={{ color: "white" }}>GET STARTED</Text>
          </Pressable>
        </Link>

        <Link href="/login" asChild>
          <Pressable style={styles.buttonLogin}>
            <Text style={{ color: "red" }}>I ALREADY HAVE AN ACCOUNT</Text>
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
    marginTop: 70,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    marginBottom: 20,
  },
  buttonLogin: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "red",
    marginBottom: 60,
  },
});

export default Welcome;

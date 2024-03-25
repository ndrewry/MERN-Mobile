import { Pressable, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { View } from "@/components/Themed";

const Welcome = () => {
  return (
    <View style={styles.container}>
      <Link href="/login" asChild>
        <Pressable>
          <Text>Login</Text>
        </Pressable>
      </Link>
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
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Welcome;

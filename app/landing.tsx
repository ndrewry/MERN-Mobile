import {
  Pressable,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import * as Progress from "react-native-progress";
import { Link } from "expo-router";
import { View } from "@/components/Themed";
import BackButton from "@/components/BackButton";
import React from "react";
import { useNavigation } from "expo-router";

const Landing = () => {
  const navigation = useNavigation();

  const courses = [
    {
      Language: "c++",
      Description: "c ++ descpription",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1822px-ISO_C%2B%2B_Logo.svg.png",
    },
    {
      Language: "python",
      Description: "python descpription",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png",
    },
    {
      Language: "haskell",
      Description: "haskell descpription",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Haskell-Logo.svg/2560px-Haskell-Logo.svg.png",
    },
  ];

  const userCourses = [
    {
      Language: "c++",
      CurrentQuestion: 6,
      NumCorrect: 2,
    },
    {
      Language: "python",
      CurrentQuestion: 7,
      NumCorrect: 6,
    },
    {
      Language: "haskell",
      CurrentQuestion: 2,
      NumCorrect: 2,
    },
  ];

  // handle pressing a card
  function handlePress() {
    // retrieve UserCourse data from the server
  }

  var imgPath = "null";
  function returnCourseDesc(courseName: string) {
    // retrieve course information from the server
    // for now static
    let desc = courses.find((course) => course.Language === courseName) || {
      Language: "null",
      Description: "null",
      image: "null",
    };
    imgPath = desc.image;
    return desc.Description;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={userCourses}
        renderItem={({ item }) => (
          <Pressable style={[styles.option, styles.shadowProp]}>
            <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>
              {returnCourseDesc(item.Language)}
            </Text>
            <Image
              source={{
                uri: imgPath,
              }}
              style={[styles.image, styles.shadowProp]}
              resizeMode="contain"
            />
            <Progress.Bar color={"red"} progress={0.3} width={200} />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      {/* {<Pressable style={[styles.option, styles.shadowProp]}>
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
      </Pressable>} */}

      <Pressable onPress={() => navigation.navigate("login")}>
        <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>
          Logout
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    width: 300,
    height: 200,
    backgroundColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    marginVertical: 10,
  },
  image: {
    width: "50%", // Adjust the width as needed
    height: "40%", // Adjust the height as needed
    marginVertical: 10,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  separator: {
    width: "100%",
    height: 3,
    backgroundColor: "#f1f2f6",
  },
});

export default Landing;

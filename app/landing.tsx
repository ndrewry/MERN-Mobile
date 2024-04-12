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
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

var imgPath = "null";
var progress = 0.3;
var token = "null";
var storage = require("./tokenStorage.js");
type courseInfo = {
  Language: string;
  Description: string;
  LogoFile: string;
};

type userCourse = {
  Language: string;
  CurrentQuestion: number;
  NumCorrect: number;
};
function returnCourseInfo(courseName: string, courses: courseInfo[]) {
  let desc = courses.find((course) => course.Language === courseName) || {
    Language: "null",
    Description: "null",
    LogoFile: "null",
  };
  imgPath = desc.LogoFile;
  return desc.Description;
}

function getCourseInfo(courses: any) {
  var courseInfoArray: any = [];
  return new Promise(async (resolve, reject) => {
    let promises = [];
    for (let i = 0; i < courses.length; i++) {
      var config = {
        method: "get",
        url:
          "http://syntax-sensei-a349ca4c0ed0.herokuapp.com/api/getCourse/" +
          courses[i].Language,
      };
      //console.log("url: ", config.url);
      let promise = axios(config)
        .then(function (response) {
          var res = response.data;
          if (res.error) {
            console.log("Error getting course info");
          } else {
            try {
              //console.log("res: ", res);
              courseInfoArray.push(res.courseData);
            } catch (e: any) {
              console.log(e.toString());
              return "";
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      promises.push(promise);
    }

    await Promise.all(promises);
    //.log("courseInfoArray: ", courseInfoArray);
    resolve(courseInfoArray);
  });
}

const getCourses = async () => {
  type configType = {
    method: string;
    url: string;
    headers: {
      Authorization: string;
    };
  };
  var config: configType = {
    method: "get",
    url: "http://syntax-sensei-a349ca4c0ed0.herokuapp.com/api/user-courses",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  //console.log("config: ", config);

  try {
    const response = await axios(config);
    var res = response.data;
    if (res.error) {
      return null;
    } else {
      return res.courses;
    }
  } catch (error) {
    console.log(error);
  }
};

const GetQuestionBank = async (courseName: string) => {
  try {
    const response = await axios.get(
      "http://syntax-sensei-a349ca4c0ed0.herokuapp.com/api/course-question-bank/" +
        courseName
    );
    const { questions, error } = response.data;
    //console.log("response in get q: ", response.data);

    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }
    return questions;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const HandlePress = async (
  item: userCourse,
  token: string,
  navigation: any
): Promise<any> => {
  try {
    const QuestionBank = await GetQuestionBank(item.Language);
    // console.log("Questions in handlepress: ", Questions);
    navigation.push("questions", {
      QuestionBank: QuestionBank,
      userCourse: item,
      token: token,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const Landing = () => {
  const navigation = useNavigation();

  const [courses, setCourses] = useState<userCourse[]>([]); // userCourses
  const [courseInfo, setCourseInfo] = useState([]); // courseInfo
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let ignore = false;

    AsyncStorage.getItem("token").then((t: any) => {
      token = t;
      var res = getCourses();

      if (res !== null) {
        res.then((res) => {
          if (ignore) return;

          setCourses(res);

          getCourseInfo(res).then((courseInfoArray: any) => {
            setCourseInfo(courseInfoArray);
            setIsLoaded(true);
          });
        });
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      let ignore = false;
      AsyncStorage.getItem("token").then((t: any) => {
        token = t;
        var res = getCourses();

        if (res !== null) {
          res.then((res) => {
            if (ignore) return;

            setCourses(res);

            getCourseInfo(res).then((courseInfoArray: any) => {
              setCourseInfo(courseInfoArray);
              setIsLoaded(true);
            });
          });
        }
      });
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={courses}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.option, styles.shadowProp]}
            onPress={() => HandlePress(item, token, navigation)}
          >
            <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>
              {returnCourseInfo(item.Language, courseInfo)}
            </Text>
            <Image
              source={{
                uri: imgPath,
              }}
              style={[styles.image, styles.shadowProp]}
              resizeMode="contain"
            />
            <Progress.Bar
              color={"red"}
              progress={item.CurrentQuestion / 10}
              width={200}
            />
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

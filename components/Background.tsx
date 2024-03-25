import React from "react";
import { View, StyleSheet } from "react-native";
import Video from "react-native-video";

const VideoBackground = () => {
  return (
    <View style={styles.container}>
      <Video
        source={require("../images/background.mp4")}
        style={styles.video}
        resizeMode="cover"
        repeat={true}
      />
      {/* Your other content goes here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default VideoBackground;

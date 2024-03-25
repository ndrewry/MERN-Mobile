import React from "react";
import { View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BackButton = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View>
      <Button title="Go Back" onPress={handleGoBack} />
    </View>
  );
};

export default BackButton;

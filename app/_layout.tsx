import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useColorScheme } from "@/components/useColorScheme";
import LoginScreen from "./login";
import ModalScreen from "./modal";
import Welcome from "./welcome";
import { useNavigation } from "expo-router";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignupScreen from "./signup";
import Landing from "./landing";
import Unverified from "./unverified";
import React from "react";
import Questions from "./questions";
import "react-native-gesture-handler";
import ForgotPassword from "./forgotPassword";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const Stack = createNativeStackNavigator();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="forgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="landing"
          component={Landing}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="unverified"
          component={Unverified}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="questions"
          component={Questions}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </ThemeProvider>
  );
}

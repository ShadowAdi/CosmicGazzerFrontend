import { Stack } from "expo-router";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { View } from "react-native";
import { useEffect } from "react";
import { getToken } from "@/utils/Token";
import { AuthStoreProvider } from "@/store/authStore";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#121212", // your custom color
    card: "#121212",
    text: "#ffffff",
    border: "transparent",
    primary: "#1DB954",
  },
};

export default function RootLayout() {
  return (
    <AuthStoreProvider>
      <ThemeProvider value={MyTheme}>
        <View style={{ flex: 1, backgroundColor: "#121212" }}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </ThemeProvider>
    </AuthStoreProvider>
  );
}

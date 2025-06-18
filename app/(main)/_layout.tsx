import { Stack, Tabs } from "expo-router";
import React from "react";

const MainLayout = () => {
  return (
    <Tabs  screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#aaa",
        tabBarStyle: {
          backgroundColor: "#1a1a3e",
          borderTopColor: "#333",
        },
        headerShown: false,
      }}>
      <Stack.Screen name="home" options={{ title: "Home" }} />
      <Stack.Screen name="events" options={{ title: "Events" }} />
    </Tabs>
  );
};

export default MainLayout;

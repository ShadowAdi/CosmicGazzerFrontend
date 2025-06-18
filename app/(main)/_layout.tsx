import {  Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons"; // or any icon lib

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
     <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default MainLayout;

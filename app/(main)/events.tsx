import { Alert, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { EventResponseInterface } from "@/types";
import { BACKEND_URL } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import EventCard from "@/components/EventCard";

const Events = () => {
  const [events, setEvents] = useState<EventResponseInterface[]>([]);
  const GetAllEvents = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}cosmic-events/filter`, {
        method: "GET",
      });
      const data = await response.json();
      console.log("data ", JSON.stringify(data, null, 2));
      const { statusCode, success, message, events } = data;
      if (success && statusCode === 200) {
        setEvents(events);
      } else {
        Alert.alert("Failed to get Events", message);
        console.log("data ", data);
      }
    } catch (error: any) {
      Alert.alert("Failed to get Events", error);
      console.log("Error in getting data ", error);
    }
  };
  useEffect(() => {
    GetAllEvents();
  }, []);
  return (
    <LinearGradient
      colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
      style={styles.container}
    >
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <EventCard event={item} />}
      />
    </LinearGradient>
  );
};

export default Events;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 52,
  },
});

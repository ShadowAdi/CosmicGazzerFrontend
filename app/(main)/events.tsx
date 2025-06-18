import { Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { EventResponseInterface } from "@/types";
import EventCard from "@/components/EventCard";
import { BACKEND_URL } from "@/constants";

const Events = () => {
  const [events, setEvents] = useState<EventResponseInterface[]>([]);
  const GetAllEvents = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}cosmic-events/filter`, {
        method: "GET",
      });
      const data = await response.json();
      const { statusCode, success, message, posts } = data;
      if (success && statusCode === 200) {
        setEvents(posts);
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
    <ScrollView>
      {events.map((event, i) => (
        <EventCard key={i} event={event} />
      ))}
    </ScrollView>
  );
};

export default Events;

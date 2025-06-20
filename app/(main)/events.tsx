import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { EventResponseInterface } from "@/types";
import { BACKEND_URL } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import EventCard from "@/components/EventCard";
import { useRouter } from "expo-router";
import { AuthContext} from "@/store/authStore";
import { getToken } from "@/utils/Token";

const Events = () => {
  const [events, setEvents] = useState<EventResponseInterface[]>([]);
  const router = useRouter();

  const { fetchUser, token, user, loading, setToken } =
    useContext(AuthContext);

  const GetToken = async () => {
    try {
      const localToken = await getToken("token");
      if (localToken) {
        setToken(localToken);
      } else {
        return;
      }
    } catch (error: any) {
      Alert.alert("Error in getting token: ", error);
      console.log("Error in getting token: ", error);
    }
  };

  const GetAllEvents = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}cosmic-events/filter`, {
        method: "GET",
      });
      const data = await response.json();
      const { statusCode, success, message, events } = data;
      if (success && statusCode === 200) {
        setEvents(events);
      } else {
        Alert.alert("Failed to get Events", message);
      }
    } catch (error: any) {
      Alert.alert("Failed to get Events", error.message);
      console.log("Error in getting data ", error);
    }
  };

  useEffect(() => {
    GetToken();
  }, []);

  useEffect(() => {
    GetAllEvents();
  }, []);

  useEffect(() => {
    if (loading && token) {
      fetchUser(token);
    }
  }, [token,loading]);

  const handleCreateEvent = () => {
    router.navigate("CreateEvent" as never);
  };

  return (
    <LinearGradient
      colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Cosmic Events</Text>
        {!loading && user && (
          <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
            <Text style={styles.buttonText}>+ Create Event</Text>
          </TouchableOpacity>
        )}
      </View>

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
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});

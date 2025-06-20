import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { EventResponseInterface, UserInterface } from "@/types"; // Adjust based on your types
import { BACKEND_URL } from "@/constants";
import { AuthContext } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons"; // For icons (install expo-vector-icons if not installed)
import { getToken } from "@/utils/Token";

const EventDetails = () => {
  const { eventId } = useLocalSearchParams();
  const [event, setEvent] = useState<EventResponseInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token, setToken, user, fetchUser } = useContext(AuthContext);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}cosmic-events/${eventId}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.success && data.statusCode === 200) {
        setEvent(data.findEvent);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch event details");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch event details");
    }
  };

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

  useEffect(() => {
    GetToken();
  }, []);

  useEffect(() => {
    if (eventId && token) {
      fetchEvent();
    }
  }, [eventId, token]);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [token]);

  useEffect(() => {
    if (event) {
      setLoading(false);
    }
  }, [event]);

  if (loading || !event) {
    return (
      <LinearGradient
        colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
        style={styles.container}
      >
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const handleInterested = async () => {
    try {
      console.log("token ", token);
      const response = await fetch(
        `${BACKEND_URL}cosmic-events/join/${eventId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", data?.message);
        fetchEvent(); // Refresh event to update interested count
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{event.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.eventType}>{event.type}</Text>
          <Text style={styles.description}>
            {event.description || "No description available."}
          </Text>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color="#A0A0C0" />
            {event.startTime && (
              <Text style={styles.detailText}>
                Starts: {formatDate(event.startTime)}
              </Text>
            )}
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color="#A0A0C0" />
            {event.endTime && (
              <Text style={styles.detailText}>
                Ends: {formatDate(event.endTime)}
              </Text>
            )}
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color="#A0A0C0" />
            <Text style={styles.detailText}>
              Visible in: {event.visibilityRegions.join(", ") || "Global"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="moon-outline" size={18} color="#A0A0C0" />
            <Text style={styles.detailText}>
              Moon Phase: {event.moonPhase ? `${event.moonPhase}%` : "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={18} color="#A0A0C0" />
            <Text style={styles.detailText}>
              Interested: {event.interestedUserIds.length} users
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="link-outline" size={18} color="#A0A0C0" />
            <Text style={styles.detailText}>
              Source: {event.source || "Unknown"}
            </Text>
          </View>
        </View>

        <View style={styles.postedBy}>
          <Text style={styles.sectionTitle}>Posted By</Text>
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => {
              router.push({
                pathname: "/(profile)/[profileId]",
                params: { profileId: String(event.postedUserId._id) },
              });
            }}
            disabled={!event?.postedUserId?._id}
          >
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {event?.postedUserId?.name || "Unknown User"}
              </Text>
              <Text style={styles.userBio}>
                {event?.postedUserId?.bio || "No bio available."}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {event.interestedUserIds.includes(user?._id || "") ? (
          <View
            style={[
              styles.interestedButton,
              { backgroundColor: "#009e60", borderRadius: 10 },
            ]}
          >
            <Text style={styles.buttonText}>You are already interested</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.interestedButton}
            onPress={handleInterested}
          >
            <Text style={styles.buttonText}>Mark as Interested</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default EventDetails;

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
    flex: 1,
    textAlign: "center",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  eventType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A90E2",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#D0D0E0",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#A0A0C0",
    marginLeft: 8,
  },
  postedBy: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  userCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: "#D0D0E0",
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: "#A0A0C0",
  },
  interestedButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

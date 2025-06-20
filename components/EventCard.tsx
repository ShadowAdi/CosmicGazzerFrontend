import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Linking,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { EventResponseInterface } from "@/types";
import { format } from "date-fns";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const EventCard = ({ event }: { event: EventResponseInterface }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/(events)/[eventId]",
          params: { eventId: String(event._id) },
        });
      }}
      style={styles.card}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{event.name}</Text>

        <Text style={styles.statsRow}>
          🌠 {event.type}        | 🌕 {event.moonPhase}%
        </Text>

        <Text style={styles.time}>
          📅 {format(new Date(event.startTime), "dd MMM yyyy, hh:mm a")} -{" "}
          {format(new Date(event.endTime), "hh:mm a")}
        </Text>

        <Text numberOfLines={3} style={styles.description}>
          {event.description}
        </Text>

        <Text style={styles.meta}>
          🌍 Visible In: {event.visibilityRegions?.join(", ") || "Unknown"}
        </Text>

        <Text style={styles.meta}>
          ❤️ {event.interestedUserIds?.length || 0} interested
        </Text>

        {event.source && (
          <Text
            style={styles.source}
            onPress={() => Linking.openURL(event.source)}
          >
            🔗 Source
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          📤 Posted by: {event.postedUserId?.name || "Anonymous"}
        </Text>
        <Text style={styles.footerText}>
          🕒 {format(new Date(event.createdAt), "dd MMM, yyyy")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    width: screenWidth - 32,
    alignSelf: "center",
    backgroundColor: "#1f1f2e",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  statsRow: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 6,
  },
  time: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#ddd",
    marginBottom: 8,
  },
  meta: {
    fontSize: 13,
    color: "#bbb",
    marginBottom: 4,
  },
  source: {
    color: "#1e90ff",
    marginTop: 6,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  footer: {
    backgroundColor: "#2a2a40",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#444",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    color: "#aaa",
    fontSize: 12,
  },
});

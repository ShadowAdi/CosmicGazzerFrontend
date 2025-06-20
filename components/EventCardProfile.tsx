import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Linking,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { format } from "date-fns";
import { EventResponseInterface } from "@/types";

const screenWidth = Dimensions.get("window").width;

const formatSafeDate = (dateString: string | undefined | null|Date) => {
  try {
    if (!dateString) return "Invalid date";
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy, hh:mm a");
  } catch (e) {
    return "Invalid date";
  }
};

const EventCardProfile = ({ event }: { event: EventResponseInterface }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>{event.name}</Text>

        <Text style={styles.statsRow}>
          🌠 {event.type}        | 🌕 {event.moonPhase ?? 0}%
        </Text>

        <Text style={styles.time}>
          📅 {formatSafeDate(event.startTime)} - {formatSafeDate(event.endTime)}
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
          🕒 {formatSafeDate(event.createdAt)}
        </Text>
      </View>
    </View>
  );
};

export default EventCardProfile;

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

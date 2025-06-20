import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { PostResponseInterface } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "expo-router";
import { BACKEND_URL } from "@/constants";

const PostCard = ({
  postData,
  token,
}: {
  postData: PostResponseInterface;
  token: string | null;
}) => {
  const {
    imageUrl,
    caption,
    location,
    visibilityScore,
    likesCount,
    dislikesCount,
    createdAt,
    userId,
  } = postData;

  const [longitude, latitude] = location.coordinates;
  const router = useRouter();

  const handleLike = async () => {
    if (!token) {
      Alert.alert("Not Authorised", "Token do not found");
    }
    try {
      const response = await fetch(
        `${BACKEND_URL}posts/post/like/${postData._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", data?.message);
      } else {
        Alert.alert("Error", data.message || "Failed to like post");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to like post");
    }
  };

  // Handle dislike action
  const handleDislike = async () => {
    if (!token) {
      Alert.alert("Not Authorised", "Token do not found");
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}posts/post/dislike/${postData._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", data?.message);
      } else {
        Alert.alert("Error", data.message || "Failed to dislike post");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to dislike post");
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/(posts)/[postId]",
          params: { postId: String(postData._id) },
        });
      }}
      style={styles.card}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.caption}>{caption}</Text>
        <Text style={styles.location}>
          📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </Text>
        <View style={styles.statsRow}>
          <Text style={styles.meta}>😶‍🌫️ {visibilityScore}</Text>
          <TouchableOpacity
             onPress={()=>{
            handleLike()
          }}
            style={{ display: "flex", alignItems: "center", rowGap: 6 }}
          >
            <Text style={styles.meta}>👍 {likesCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{
            handleDislike()
          }}
            style={{ display: "flex", alignItems: "center", rowGap: 6 }}
          >
            <Text style={styles.meta}>👎 {dislikesCount}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.time}>
          {formatDistanceToNow(new Date(createdAt))} ago
        </Text>
      </View>

      {/* Footer with creator info */}
      <View style={styles.footer}>
        <Text style={styles.creatorName}>👤 {userId?.name || "Unknown"}</Text>
        <Text style={styles.creatorEmail}>{userId?.email || "-"}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;

const screenWidth = Dimensions.get("window").width;

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
  image: {
    width: "100%",
    height: 220,
  },
  content: {
    padding: 16,
  },
  caption: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: "#aaa",
  },
  time: {
    fontSize: 12,
    color: "#777",
    textAlign: "right",
  },
  footer: {
    backgroundColor: "#2a2a40",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#444", // not too black, visible on gradient
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  creatorName: {
    color: "#ddd",
    fontSize: 14,
    fontWeight: "500",
  },
  creatorEmail: {
    color: "#aaa",
    fontSize: 12,
  },
});

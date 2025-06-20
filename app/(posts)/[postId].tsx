import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND_URL } from "@/constants";
import { AuthContext } from "@/store/authStore";
import { PostResponseInterface } from "@/types";
import MapView, { Marker } from "react-native-maps";

const SinglePost = () => {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState<PostResponseInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token } = useContext(AuthContext);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}posts/post/${postId}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.success && data.statusCode === 200) {
        console.log("data ", data.findPost);
        setPost(data.findPost);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch post details");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch post details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId && token) {
      fetchPost();
    }
  }, [postId, token]);

  // Handle like action
  const handleLike = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}posts/post/like/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", data?.message);
        fetchPost(); // Refresh post to update likes count
      } else {
        Alert.alert("Error", data.message || "Failed to like post");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to like post");
    }
  };

  // Handle dislike action
  const handleDislike = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}posts/post/dislike/${postId}`,
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
        fetchPost(); // Refresh post to update dislikes count
      } else {
        Alert.alert("Error", data.message || "Failed to dislike post");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to dislike post");
    }
  };

  if (loading || !post) {
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

  return (
    <LinearGradient
      colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Post Details</Text>
        <View style={{ width: 24 }} /> {/* Placeholder for symmetry */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {post.imageUrl && (
            <Image
              source={{ uri: post.imageUrl }}
              style={styles.postImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.caption}>{post.caption}</Text>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color="#A0A0C0" />
            <Text style={styles.detailText}>
              Posted: {formatDate(post.createdAt)}
            </Text>
          </View>
          <View style={styles.detailRow1}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Ionicons name="location-outline" size={18} color="#A0A0C0" />
              <Text style={styles.detailText}>
                Location: {post.location?.coordinates.join(", ") || "N/A"}
              </Text>
            </View>
            {post.location?.coordinates && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: post.location?.coordinates[1],
                  longitude: post.location?.coordinates[0],
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: post.location?.coordinates[1],
                    longitude: post.location?.coordinates[0],
                  }}
                  title="Post Location"
                />
              </MapView>
            )}
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="eye-outline" size={18} color="#A0A0C0" />
            <Text style={styles.detailText}>
              Visibility Score: {post.visibilityScore}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="thumbs-up-outline" size={18} color="#A0A0C0" />
            <Text style={styles.detailText}>Likes: {post.likesCount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="thumbs-down-outline" size={18} color="#A0A0C0" />
            <Text style={styles.detailText}>
              Dislikes: {post.dislikesCount}
            </Text>
          </View>
          {post.eventId && (
            <>
              <View style={styles.detailRow}>
                <Ionicons name="sparkles-outline" size={18} color="#A0A0C0" />
                <Text style={styles.detailText}>
                  Event Type: {post.eventId.type || "N/A"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={18} color="#A0A0C0" />
                <Text style={styles.detailText}>
                  Starts: {formatDate(post.eventId.startTime)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={18} color="#A0A0C0" />
                <Text style={styles.detailText}>
                  Ends: {formatDate(post.eventId.endTime)}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.postedBy}>
          <Text style={styles.sectionTitle}>Posted By</Text>
          <TouchableOpacity
            style={styles.userCard}
            onPress={() =>
              post.userId?._id
                ? router.navigate(`/profile/${post.userId._id}` as never)
                : null
            }
            disabled={!post.userId?._id}
          >
            <Text style={styles.userName}>
              {post.userId?.name || "Unknown User"}
            </Text>
            <Text style={styles.userBio}>
              {post.userId?.bio || "No bio available."}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={handleLike}
          >
            <Text style={styles.buttonText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.dislikeButton]}
            onPress={handleDislike}
          >
            <Text style={styles.buttonText}>Dislike</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SinglePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 52,
    paddingBottom: 18,
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
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  caption: {
    fontSize: 16,
    color: "#D0D0E0",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailRow1: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 8,
    marginTop: 8,
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  likeButton: {
    backgroundColor: "#4A90E2",
  },
  dislikeButton: {
    backgroundColor: "#E24A4A",
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
  map: {
    width: "100%",
    height: 200,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 18,
  },
});

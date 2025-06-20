import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { PostResponseInterface } from "@/types";
import { BACKEND_URL } from "@/constants";
import PostCard from "@/components/PostCard";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "@/store/authStore";
import { getToken } from "@/utils/Token";
import { useRouter } from "expo-router";

const Home = () => {
  const [posts, setPosts] = useState<PostResponseInterface[]>([]);
  const router = useRouter();

  const { fetchUser, token, user, loading, setToken } = useContext(AuthContext);

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

  const GetAllPosts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}posts`);
      const data = await response.json();
      const { success, statusCode, message, posts } = data;

      if (success && statusCode === 200) {
        setPosts(posts);
      } else {
        Alert.alert("Failed to get Posts", message);
        console.log("data ", data);
      }
    } catch (error: any) {
      Alert.alert("Failed to get Posts", error.message);
      console.log("Error in getting data ", error);
    }
  };

  useEffect(() => {
    GetAllPosts();
  }, []);

  useEffect(() => {
    GetToken();
  }, []);

  useEffect(() => {
    if (loading && token) {
      fetchUser(token);
    }
  }, [token, loading]);

  const handlePostEvent = () => {
    router.navigate("CreatePost" as never);
  };

  return (
    <LinearGradient
      colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Cosmic Posts</Text>
        {!loading && user && (
          <TouchableOpacity style={styles.button} onPress={handlePostEvent}>
            <Text style={styles.buttonText}>+ Create Post</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PostCard postData={item} token={token} />}
      />
    </LinearGradient>
  );
};

export default Home;

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

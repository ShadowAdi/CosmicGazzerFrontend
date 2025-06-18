import { Alert, FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { PostResponseInterface } from "@/types";
import { BACKEND_URL } from "@/constants";
import PostCard from "@/components/PostCard";
import { LinearGradient } from "expo-linear-gradient";

const Home = () => {
  const [posts, setPosts] = useState<PostResponseInterface[]>([]);

  const GetAllPosts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}posts`);
      const data = await response.json();
      const { success, statusCode, message, posts } = data;

      if (success && statusCode === 200) {
        setPosts(posts);
        console.log("posts ",posts)
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

  return (
    <LinearGradient
      colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
      style={styles.container}
    >
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PostCard postData={item} />}
      />
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:52
  },
});

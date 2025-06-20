import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {  UserInterfaceProfile } from "@/types";
import EventCard from "@/components/EventCard";
import { BACKEND_URL } from "@/constants";
import MapView, { Marker } from "react-native-maps";
import { AuthContext } from "@/store/authStore";
import EventCardProfile from "@/components/EventCardProfile";

const ProfileScreen = () => {
  const { user, loading } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState<UserInterfaceProfile | null>(
    null
  );
  const [userLoading, setUserLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}users/user/${user?._id}`);
      const data = await res.json();
      console.log("data ", data);

      if (data.success && data.findUsers) {
        setUserDetails(data.findUsers);
      } else {
        Alert.alert("Failed", data.message || "Couldn't load user profile.");
      }
    } catch (error) {
      console.log("Error fetching user:", error);
      Alert.alert("Error", "Something went wrong fetching user details.");
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user && user?._id) {
      fetchUserDetails();
    }
  }, [user?._id]);

  if (loading && userLoading) {
    return (
      <LinearGradient
        colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
        style={styles.container}
      >
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
      style={styles.container}
    >
      <View style={styles.profileContainer}>
        <Text style={styles.name}>{userDetails?.name}</Text>
        <Text style={styles.email}>{userDetails?.email}</Text>
        {userDetails?.bio ? (
          <Text style={styles.bio}>{userDetails.bio}</Text>
        ) : null}
      </View>
      {userDetails?.location?.coordinates && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userDetails.location.coordinates[1],
            longitude: userDetails.location.coordinates[0],
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              latitude: userDetails.location.coordinates[1],
              longitude: userDetails.location.coordinates[0],
            }}
            title={userDetails.name}
            description={userDetails.bio || "User location"}
          />
        </MapView>
      )}

      <Text style={styles.sectionTitle}>Saved Events</Text>
      <FlatList
        data={userDetails?.savedEvents}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <EventCardProfile event={item} />}
      />
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 52,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  profileContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 4,
  },
  bio: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 12,
  },
  map: {
  width: "100%",
  height: 200,
  marginTop: 16,
  borderRadius: 16,
  overflow: "hidden",
},
});

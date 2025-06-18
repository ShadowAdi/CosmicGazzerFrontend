// components/CosmicBackground.js
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export default function CosmicBackground({ children }:{children:ReactNode}) {
  return (
    <LinearGradient
      colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Animated Stars */}
      <View style={styles.starsContainer}>
        {[...Array(50)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              },
            ]}
          />
        ))}
      </View>

      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  starsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  star: {
    position: "absolute",
    width: 2,
    height: 2,
    backgroundColor: "#ffffff",
    borderRadius: 1,
    opacity: 0.8,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
});

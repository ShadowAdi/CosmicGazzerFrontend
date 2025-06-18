import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.starsContainer}>
        {[...Array(50)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              },
            ]}
          />
        ))}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Cosmic Gazzer</Text>
          <Text style={styles.subtitle}>Explore • Discover • Share</Text>
          <View style={styles.divider} />
          <Text style={styles.description}>
            Journey through the cosmos and share your astronomical discoveries
          </Text>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              zIndex: 30,
            }}
          >
            <TouchableOpacity
              style={styles.spaceButton}
              onPress={() => {
                console.log("Button Pressed");
                router.push("/(auth)/signup");
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Explore</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Floating Planets */}
        <View style={styles.planetsContainer}>
          <View style={[styles.planet, styles.planet1]} />
          <View style={[styles.planet, styles.planet2]} />
          <View style={[styles.planet, styles.planet3]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a23",

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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    paddingHorizontal: 20,
  },
  titleContainer: {
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    gap: 12,
    paddingVertical: 40,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: 32,
    color: "#ffffff",
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(138, 43, 226, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#b8860b",
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: "#4169e1",
    marginVertical: 8,
    shadowColor: "#4169e1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  description: {
    fontSize: 14,
    color: "#cccccc",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
    fontStyle: "italic",
  },
  planetsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  planet: {
    position: "absolute",
    borderRadius: 50,
    opacity: 0.3,
  },
  planet1: {
    width: 80,
    height: 80,
    backgroundColor: "#ff6b6b",
    top: "15%",
    right: "10%",
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  planet2: {
    width: 60,
    height: 60,
    backgroundColor: "#4ecdc4",
    bottom: "25%",
    left: "8%",
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
  planet3: {
    width: 40,
    height: 40,
    backgroundColor: "#ffd93d",
    top: "40%",
    left: "15%",
    shadowColor: "#ffd93d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  spaceButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 28,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginTop: 12,
  },
  textBtn: {
    fontSize: 14,
    color: "white",
    fontWeight: 500,
  },
});

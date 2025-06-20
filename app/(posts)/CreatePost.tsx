import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { BACKEND_URL } from "@/constants";
import { AuthContext } from "@/store/authStore";
import { getToken } from "@/utils/Token";

const { width } = Dimensions.get('window');

interface Event {
  _id: string;
  name: string;
  type: string;
  startTime: string;
  endTime: string;
}

const CreatePostScreen = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    eventId: "",
    imageUrl: "",
    caption: "",
    location: {
      coordinates: [0, 0], // [longitude, latitude]
    },
    visibilityScore: "",
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { fetchUser, token, user, loading, setToken } = useContext(AuthContext);

  const GetToken = async () => {
    try {
      const localToken = await getToken("token");
      if (localToken) {
        setToken(localToken);
      }
    } catch (error: any) {
      Alert.alert("Error in getting token: ", error);
      console.log("Error in getting token: ", error);
    }
  };

  const GetAllEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const response = await fetch(`${BACKEND_URL}cosmic-events/filter`);
      const data = await response.json();
      
      if (data?.success) {
        setEvents(data.events || []);
      } else {
        Alert.alert("Failed to get Events", data?.message || "Unknown error");
        console.log("Events data ", data);
      }
    } catch (error: any) {
      Alert.alert("Failed to get Events", error.message);
      console.log("Error in getting events ", error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    GetToken();
  }, []);

  useEffect(() => {
    if (!loading && token && !user) {
      fetchUser(token);
    }
  }, [token, loading]);

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/(auth)/signin");
    }
  }, [loading, token]);

  useEffect(() => {
    if (token) {
      GetAllEvents();
    }
  }, [token]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLocationChange = (type: 'longitude' | 'latitude', value: string) => {
    const numValue = parseFloat(value) || 0;
    setForm(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: type === 'longitude' 
          ? [numValue, prev.location.coordinates[1]]
          : [prev.location.coordinates[0], numValue]
      }
    }));
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setForm(prev => ({ ...prev, eventId: event._id }));
    setShowEventPicker(false);
  };

  const handleImageUrlChange = (url: string) => {
    handleChange("imageUrl", url);
    setImageError(false);
    if (url.trim()) {
      setImageLoading(true);
    }
  };

  const validateForm = () => {
    if (!form.eventId) {
      Alert.alert("Validation Error", "Please select an event");
      return false;
    }
    if (!form.imageUrl.trim()) {
      Alert.alert("Validation Error", "Image URL is required");
      return false;
    }
    if (!form.caption.trim()) {
      Alert.alert("Validation Error", "Caption is required");
      return false;
    }
    if (!form.visibilityScore || isNaN(parseFloat(form.visibilityScore))) {
      Alert.alert("Validation Error", "Valid visibility score (1-10) is required");
      return false;
    }
    const visibilityValue = parseFloat(form.visibilityScore);
    if (visibilityValue < 1 || visibilityValue > 10) {
      Alert.alert("Validation Error", "Visibility score must be between 1 and 10");
      return false;
    }
    if (imageError) {
      Alert.alert("Validation Error", "Please provide a valid image URL");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!token) {
      Alert.alert("Authentication Error", "Please sign in to create posts");
      return;
    }

    setIsSubmitting(true);
    try {
        const {eventId,...dataSend}=form
      const response = await fetch(`${BACKEND_URL}posts/${form.eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...dataSend,
          visibilityScore: parseFloat(form.visibilityScore),
        }),
      });

      const data = await response.json();
      if (data?.success) {
        Alert.alert("Success", "Post Created Successfully");
        router.back();
      } else {
        console.log("error ", data?.message )
        Alert.alert("Error", data?.message || "Failed to create post");
      }
    } catch (error: any) {
      Alert.alert("Network Error", error.message || "Something went wrong");
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <LinearGradient
        colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
        style={[styles.container, styles.centered]}
      >
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  if (!token) {
    return (
      <LinearGradient
        colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
        style={[styles.container, styles.centered]}
      >
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Redirecting...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Create New Post</Text>

        {/* Event Selection */}
        <Text style={styles.label}>Select Event *</Text>
        <TouchableOpacity
          style={[styles.input, styles.eventSelector]}
          onPress={() => setShowEventPicker(!showEventPicker)}
          disabled={isLoadingEvents}
        >
          <Text style={[styles.inputText, !selectedEvent && styles.placeholder]}>
            {isLoadingEvents 
              ? "Loading events..."
              : selectedEvent 
                ? `${selectedEvent.name} (${selectedEvent.type})`
                : "Choose an event..."
            }
          </Text>
          <Text style={styles.dropdownIcon}>{showEventPicker ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {/* Event Picker Dropdown */}
        {showEventPicker && (
          <View style={styles.eventDropdown}>
            {events.length === 0 ? (
              <Text style={styles.noEventsText}>No events available</Text>
            ) : (
              events.map((event) => (
                <TouchableOpacity
                  key={event._id}
                  style={styles.eventOption}
                  onPress={() => handleEventSelect(event)}
                >
                  <Text style={styles.eventName}>{event.name}</Text>
                  <Text style={styles.eventDetails}>
                    {event.type} • {new Date(event.startTime).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Image URL Input */}
        <Text style={styles.label}>Image URL *</Text>
        <TextInput
          placeholder="https://example.com/your-image.jpg"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={form.imageUrl}
          onChangeText={handleImageUrlChange}
          autoCapitalize="none"
          keyboardType="url"
        />

        {/* Image Preview */}
        {form.imageUrl.trim() && (
          <View style={styles.imagePreviewContainer}>
            <Text style={styles.label}>Image Preview</Text>
            {imageLoading && (
              <View style={styles.imageLoadingContainer}>
                <ActivityIndicator size="small" color="#4A90E2" />
                <Text style={styles.imageLoadingText}>Loading image...</Text>
              </View>
            )}
            <Image
              source={{ uri: form.imageUrl }}
              style={styles.imagePreview}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
            {imageError && (
              <Text style={styles.imageErrorText}>
                Failed to load image. Please check the URL.
              </Text>
            )}
          </View>
        )}

        {/* Caption */}
        <Text style={styles.label}>Caption *</Text>
        <TextInput
          placeholder="Share your cosmic observation..."
          placeholderTextColor="#aaa"
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          value={form.caption}
          onChangeText={(text) => handleChange("caption", text)}
        />

        {/* Location Coordinates */}
        <Text style={styles.label}>Location (Optional)</Text>
        <View style={styles.coordinatesContainer}>
          <View style={styles.coordinateInput}>
            <Text style={styles.coordinateLabel}>Longitude</Text>
            <TextInput
              placeholder="0.0"
              placeholderTextColor="#aaa"
              style={styles.input}
              keyboardType="numeric"
              value={form.location.coordinates[0].toString()}
              onChangeText={(text) => handleLocationChange('longitude', text)}
            />
          </View>
          <View style={styles.coordinateInput}>
            <Text style={styles.coordinateLabel}>Latitude</Text>
            <TextInput
              placeholder="0.0"
              placeholderTextColor="#aaa"
              style={styles.input}
              keyboardType="numeric"
              value={form.location.coordinates[1].toString()}
              onChangeText={(text) => handleLocationChange('latitude', text)}
            />
          </View>
        </View>

        {/* Visibility Score */}
        <Text style={styles.label}>Visibility Score (1-10) *</Text>
        <TextInput
          placeholder="Rate the visibility from 1 (poor) to 10 (excellent)"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="numeric"
          value={form.visibilityScore}
          onChangeText={(text) => handleChange("visibilityScore", text)}
        />

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.button, isSubmitting && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Post</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 52,
  },
  inner: {
    padding: 16,
    gap: 12,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#2a2a50",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
    fontSize: 16,
  },
  inputText: {
    color: "#fff",
    fontSize: 16,
  },
  placeholder: {
    color: "#aaa",
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  eventSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownIcon: {
    color: "#4A90E2",
    fontSize: 16,
  },
  eventDropdown: {
    backgroundColor: "#2a2a50",
    borderRadius: 8,
    maxHeight: 200,
  },
  eventOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a60",
  },
  eventName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  eventDetails: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 2,
  },
  noEventsText: {
    color: "#aaa",
    textAlign: "center",
    padding: 20,
  },
  imagePreviewContainer: {
    marginTop: 8,
  },
  imagePreview: {
    width: '100%',
    height: width * 0.6,
    borderRadius: 8,
    backgroundColor: "#2a2a50",
  },
  imageLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  imageLoadingText: {
    color: "#aaa",
    marginLeft: 8,
  },
  imageErrorText: {
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  coordinateInput: {
    flex: 1,
  },
  coordinateLabel: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
});
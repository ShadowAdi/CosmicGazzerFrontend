import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { BACKEND_URL } from "@/constants";
import { AuthContext } from "@/store/authStore";
import { getToken } from "@/utils/Token";

const eventTypes = ["Meteor Shower", "ISS Pass", "Lunar Eclipse"];

const CreateEventScreen = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "Meteor Shower",
    startTime: new Date(),
    endTime: new Date(),
    visibilityRegions: "",
    moonPhase: "",
    source: "",
  });

  // Separate states for different picker modes
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Enhanced datetime picker handlers
  const handleDateTimeChange = (
    event: any,
    selectedDate: Date | undefined,
    type: "startDate" | "startTime" | "endDate" | "endTime"
  ) => {
    // Close all pickers first
    setShowStartDatePicker(false);
    setShowStartTimePicker(false);
    setShowEndDatePicker(false);
    setShowEndTimePicker(false);

    if (event?.type === "dismissed" || !selectedDate) {
      return;
    }

    try {
      if (type === "startDate" || type === "startTime") {
        const currentStartTime = form.startTime;
        let newStartTime: Date;

        if (type === "startDate") {
          // Update date, keep time
          newStartTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            currentStartTime.getHours(),
            currentStartTime.getMinutes()
          );
        } else {
          // Update time, keep date
          newStartTime = new Date(
            currentStartTime.getFullYear(),
            currentStartTime.getMonth(),
            currentStartTime.getDate(),
            selectedDate.getHours(),
            selectedDate.getMinutes()
          );
        }

        handleChange("startTime", newStartTime);
      } else {
        const currentEndTime = form.endTime;
        let newEndTime: Date;

        if (type === "endDate") {
          // Update date, keep time
          newEndTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            currentEndTime.getHours(),
            currentEndTime.getMinutes()
          );
        } else {
          // Update time, keep date
          newEndTime = new Date(
            currentEndTime.getFullYear(),
            currentEndTime.getMonth(),
            currentEndTime.getDate(),
            selectedDate.getHours(),
            selectedDate.getMinutes()
          );
        }

        handleChange("endTime", newEndTime);
      }
    } catch (error) {
      console.error("Error handling date/time change:", error);
      Alert.alert("Error", "Failed to update date/time");
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      Alert.alert("Validation Error", "Event name is required");
      return false;
    }
    if (!form.description.trim()) {
      Alert.alert("Validation Error", "Description is required");
      return false;
    }
    if (!form.visibilityRegions.trim()) {
      Alert.alert("Validation Error", "Visibility regions are required");
      return false;
    }
    if (!form.moonPhase || isNaN(parseFloat(form.moonPhase))) {
      Alert.alert("Validation Error", "Valid moon phase (0-1) is required");
      return false;
    }
    const moonPhaseValue = parseFloat(form.moonPhase);
    if (moonPhaseValue < 0 || moonPhaseValue > 1) {
      Alert.alert("Validation Error", "Moon phase must be between 0 and 1");
      return false;
    }
    if (form.startTime >= form.endTime) {
      Alert.alert("Validation Error", "End time must be after start time");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!token) {
      Alert.alert("Authentication Error", "Please sign in to create events");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}cosmic-events/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          visibilityRegions: form.visibilityRegions
            .split(",")
            .map((r) => r.trim())
            .filter((r) => r.length > 0),
          moonPhase: parseFloat(form.moonPhase),
        }),
      });

      const data = await response.json();
      if (data?.success) {
        Alert.alert("Success", "Event Created Successfully");
        router.back();
      } else {
        Alert.alert("Error", data?.message || "Failed to create event");
      }
    } catch (error: any) {
      Alert.alert("Network Error", error.message || "Something went wrong");
      console.error("Error creating event:", error);
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <LinearGradient
        colors={["#0a0a23", "#1a1a3e", "#2d2d5f", "#1a1a3e", "#0a0a23"]}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            placeholder="Event Name"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            placeholder="Description"
            placeholderTextColor="#aaa"
            style={[styles.input, { height: 80 }]}
            multiline
            value={form.description}
            onChangeText={(text) => handleChange("description", text)}
          />

          <Text style={styles.label}>Type</Text>
          {eventTypes.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => handleChange("type", type)}
              style={[
                styles.option,
                form.type === type && styles.selectedOption,
              ]}
            >
              <Text style={styles.optionText}>{type}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.label}>Start Date & Time</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={[styles.input, styles.dateTimeButton]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.inputText}>
                📅 {form.startTime.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.input, styles.dateTimeButton]}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={styles.inputText}>
                🕐{" "}
                {form.startTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>End Date & Time</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={[styles.input, styles.dateTimeButton]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.inputText}>
                📅 {form.endTime.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.input, styles.dateTimeButton]}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={styles.inputText}>
                🕐{" "}
                {form.endTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date/Time Pickers */}
          {showStartDatePicker && (
            <DateTimePicker
              value={form.startTime}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) =>
                handleDateTimeChange(event, selectedDate, "startDate")
              }
            />
          )}

          {showStartTimePicker && (
            <DateTimePicker
              value={form.startTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) =>
                handleDateTimeChange(event, selectedDate, "startTime")
              }
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={form.endTime}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) =>
                handleDateTimeChange(event, selectedDate, "endDate")
              }
            />
          )}

          {showEndTimePicker && (
            <DateTimePicker
              value={form.endTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) =>
                handleDateTimeChange(event, selectedDate, "endTime")
              }
            />
          )}

          <Text style={styles.label}>Visibility Regions *</Text>
          <TextInput
            placeholder="Comma-separated values (e.g. India, USA)"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={form.visibilityRegions}
            onChangeText={(text) => handleChange("visibilityRegions", text)}
          />

          <Text style={styles.label}>Moon Phase (0-1) *</Text>
          <TextInput
            placeholder="e.g. 0.75"
            placeholderTextColor="#aaa"
            style={styles.input}
            keyboardType="numeric"
            value={form.moonPhase}
            onChangeText={(text) => handleChange("moonPhase", text)}
          />

          <Text style={styles.label}>Source</Text>
          <TextInput
            placeholder="NASA, Space.com, etc."
            placeholderTextColor="#aaa"
            style={styles.input}
            value={form.source}
            onChangeText={(text) => handleChange("source", text)}
          />

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Event</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default CreateEventScreen;

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
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#2a2a50",
    padding: 10,
    borderRadius: 8,
    color: "#fff",
  },
  inputText: {
    color: "#fff",
  },
  dateTimeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dateTimeButton: {
    flex: 1,
    alignItems: "center",
  },
  option: {
    backgroundColor: "#2a2a50",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  selectedOption: {
    borderColor: "#4A90E2",
    borderWidth: 2,
  },
  optionText: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
});

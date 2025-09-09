import React, { useState, useCallback } from "react";
import {
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack } from "@tamagui/stacks";
import { Text } from "@tamagui/core";
import { Input } from "@tamagui/input";
import { Button } from "@tamagui/button";
import { H3 } from "@tamagui/text";
import { Label } from "@tamagui/label";
import { ChevronDown, Calendar, Clock } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { useTasks } from "../contexts/TasksContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import PrioritySelectionModal from "../components/PrioritySelectionModal";

export default function CreateTaskScreen() {
  const { createTask } = useTasks();
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);

  const priorities = [
    { value: 0, label: "None" },
    { value: 1, label: "Low" },
    { value: 2, label: "Medium" },
    { value: 3, label: "High" },
    { value: 4, label: "Urgent" },
    { value: 5, label: "Critical" },
  ];

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        due_date: dueDate?.toISOString(),
      });

      Alert.alert("Success", "Task created successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create task. Please try again.");
      console.error("Create task error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (dueDate) {
        // Preserve time if already set
        selectedDate.setHours(dueDate.getHours());
        selectedDate.setMinutes(dueDate.getMinutes());
      }
      setDueDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime && dueDate) {
      const newDateTime = new Date(dueDate);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setDueDate(newDateTime);
    }
  };

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <YStack flex={1} padding="$4" space="$4">
          {/* Title Field */}
          <YStack space="$2">
            <Label htmlFor="title" fontSize="$4" fontWeight="600">
              Task Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChangeText={(e: any) =>
                setTitle(typeof e === "string" ? e : e.nativeEvent?.text || "")
              }
              size="$4"
              backgroundColor="$gray1"
              borderColor="$gray6"
              focusStyle={{ borderColor: "$orange8" }}
            />
          </YStack>

          {/* Description Field */}
          <YStack space="$2">
            <Label htmlFor="description" fontSize="$4" fontWeight="600">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Enter task description (optional)"
              value={description}
              onChangeText={(e: any) =>
                setDescription(
                  typeof e === "string" ? e : e.nativeEvent?.text || "",
                )
              }
              size="$4"
              backgroundColor="$gray1"
              borderColor="$gray6"
              focusStyle={{ borderColor: "$orange8" }}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </YStack>

          {/* Priority Field */}
          <YStack space="$2">
            <Label fontSize="$4" fontWeight="600">
              Priority
            </Label>
            <TouchableOpacity onPress={() => setShowPriorityModal(true)}>
              <YStack
                paddingVertical="$3"
                paddingHorizontal="$4"
                backgroundColor="$gray1"
                borderWidth={1}
                borderColor="$gray6"
                borderRadius="$4"
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$4" color="$gray12">
                    {priorities.find((p) => p.value === priority)?.label ||
                      "Select priority"}
                  </Text>
                  <ChevronDown size={20} color="$gray10" />
                </XStack>
              </YStack>
            </TouchableOpacity>
          </YStack>

          {/* Due Date Section */}
          <YStack space="$2">
            <Label fontSize="$4" fontWeight="600">
              Due Date
            </Label>
            <XStack space="$2">
              <Button
                flex={1}
                variant="outlined"
                onPress={() => setShowDatePicker(true)}
                icon={Calendar}
                backgroundColor="$gray1"
                borderColor="$gray6"
              >
                {dueDate ? formatDate(dueDate) : "Select Date"}
              </Button>
              <Button
                flex={1}
                variant="outlined"
                onPress={() => setShowTimePicker(true)}
                icon={Clock}
                backgroundColor="$gray1"
                borderColor="$gray6"
                disabled={!dueDate}
              >
                {dueDate ? formatTime(dueDate) : "Select Time"}
              </Button>
            </XStack>
            {dueDate && (
              <Button
                size="$2"
                variant="outlined"
                onPress={() => setDueDate(undefined)}
                backgroundColor="$red1"
                borderColor="$red6"
              >
                Clear Due Date
              </Button>
            )}
          </YStack>

          {/* Date/Time Pickers */}
          {showDatePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && dueDate && (
            <DateTimePicker
              value={dueDate}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          {/* Actions */}
          <YStack space="$3" paddingTop="$4">
            <Button
              size="$4"
              backgroundColor="$orange9"
              color="white"
              onPress={handleSubmit}
              disabled={loading || !title.trim()}
              icon={
                loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : undefined
              }
            >
              {loading ? "Creating..." : "Create Task"}
            </Button>

            <Button
              size="$4"
              variant="outlined"
              onPress={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </YStack>
        </YStack>
      </ScrollView>

      <PrioritySelectionModal
        visible={showPriorityModal}
        onClose={() => setShowPriorityModal(false)}
        priorities={priorities}
        priority={priority}
        onSelect={(v) => {
          setPriority(Number(v));
          setShowPriorityModal(false);
        }}
      />
    </SafeAreaView>
  );
}

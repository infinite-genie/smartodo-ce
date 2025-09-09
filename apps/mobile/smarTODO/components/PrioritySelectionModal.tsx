import React from "react";
import { Modal, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack } from "@tamagui/stacks";
import { Text } from "@tamagui/core";
import { Button } from "@tamagui/button";
import { H3 } from "@tamagui/text";
import { Check } from "@tamagui/lucide-icons";

type PriorityType = {
  value: number | string;
  label: string;
};

type PrioritySelectionModalProps = {
  visible: boolean;
  onClose: () => void;
  priorities: PriorityType[];
  priority: number | string;
  onSelect: (value: number | string) => void;
};

export default function PrioritySelectionModal({
  visible,
  onClose,
  priorities,
  priority,
  onSelect,
}: PrioritySelectionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <YStack flex={1}>
          <YStack>
            {/* Header */}
            <XStack
              justifyContent="space-between"
              alignItems="center"
              padding="$4"
              borderBottomWidth={1}
              borderBottomColor="$gray4"
            >
              <H3 fontSize="$5" fontWeight="600">
                Select Priority
              </H3>
              <Button size="$3" variant="outlined" onPress={onClose}>
                Done
              </Button>
            </XStack>

            {/* Priority Options */}
            <FlatList
              data={priorities}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onSelect(item.value)}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f0f0f0",
                  }}
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text
                      fontSize="$4"
                      color="$gray12"
                      fontWeight={priority === item.value ? "600" : "400"}
                    >
                      {item.label}
                    </Text>
                    {priority === item.value && (
                      <Check size={20} color="#E64D13" />
                    )}
                  </XStack>
                </TouchableOpacity>
              )}
            />
          </YStack>
        </YStack>
      </SafeAreaView>
    </Modal>
  );
}

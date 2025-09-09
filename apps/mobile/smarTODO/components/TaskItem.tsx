import React from "react";
import { XStack, YStack } from "@tamagui/stacks";
import { Text } from "@tamagui/core";
import { Checkbox } from "@tamagui/checkbox";
import { Card } from "@tamagui/card";
import { Clock, RotateCw, Check } from "@tamagui/lucide-icons";
import { useTheme } from "@tamagui/core";
import { Task } from "../contexts/TasksContext";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  showFullDate?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  showFullDate = false,
}) => {
  const theme = useTheme();
  const isCompleted = task.status === "completed";

  // Build priority colors array from theme tokens
  const priorityColors = [
    theme.gray8?.val, // Priority 0: neutral gray
    theme.gray9?.val, // Priority 1: darker gray
    theme.yellow9?.val, // Priority 2: warning yellow
    theme.orange9?.val, // Priority 3: warning orange
    theme.red9?.val, // Priority 4: critical red
    theme.red10?.val, // Priority 5: most critical red
  ];

  // Clamp priority index to valid range
  const clampedIndex = Math.max(
    0,
    Math.min(task.priority, priorityColors.length - 1),
  );
  const priorityColor =
    priorityColors[clampedIndex] || theme.gray8?.val || "#999";

  // Check if task is overdue
  const isOverdue =
    task.due_date && !isCompleted && new Date(task.due_date) < new Date();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatFullDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: formatTime(dateString),
    };
  };

  return (
    <Card
      elevate
      size="$2"
      bordered
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      marginBottom="$2"
      padding="$3"
      backgroundColor={
        isCompleted ? "$gray2" : isOverdue ? "$red1" : "$background"
      }
      borderLeftColor={priorityColor}
      borderLeftWidth={3}
    >
      <XStack space="$3" alignItems="center">
        <Checkbox
          size="$5"
          checked={isCompleted}
          onCheckedChange={(_checked) => {
            if (!isCompleted) onToggle(task.id);
          }}
          borderColor={isCompleted ? "$gray8" : "$orange9"}
          backgroundColor={isCompleted ? "$gray3" : "transparent"}
          disabled={isCompleted}
          opacity={isCompleted ? 0.6 : 1}
        >
          <Checkbox.Indicator>
            <Check size={12} />
          </Checkbox.Indicator>
        </Checkbox>

        <YStack flex={1} space="$1">
          <Text
            fontSize="$4"
            fontWeight="500"
            textDecorationLine={isCompleted ? "line-through" : "none"}
            color={isCompleted ? "$gray10" : isOverdue ? "$red11" : "$gray12"}
          >
            {task.title}
          </Text>

          {task.description && (
            <Text
              fontSize="$2"
              color="$gray11"
              numberOfLines={2}
              textDecorationLine={isCompleted ? "line-through" : "none"}
            >
              {task.description}
            </Text>
          )}

          <XStack space="$2" alignItems="center">
            {task.due_date && (
              <XStack space="$1" alignItems="center">
                <Clock size={12} color={isOverdue ? "$red10" : "$gray10"} />
                {showFullDate ? (
                  <XStack space="$1">
                    <Text
                      fontSize="$1"
                      color={isOverdue ? "$red10" : "$gray10"}
                    >
                      {formatFullDateTime(task.due_date).date}
                    </Text>
                    <Text
                      fontSize="$1"
                      color={isOverdue ? "$red10" : "$gray10"}
                    >
                      {formatFullDateTime(task.due_date).time}
                    </Text>
                  </XStack>
                ) : (
                  <Text fontSize="$1" color={isOverdue ? "$red10" : "$gray10"}>
                    {formatTime(task.due_date)}
                  </Text>
                )}
              </XStack>
            )}

            {task.is_recurring && (
              <XStack space="$1" alignItems="center">
                <RotateCw size={12} color="$blue10" />
                <Text fontSize="$1" color="$blue10">
                  {task.recurrence_pattern}
                </Text>
              </XStack>
            )}
          </XStack>
        </YStack>
      </XStack>
    </Card>
  );
};

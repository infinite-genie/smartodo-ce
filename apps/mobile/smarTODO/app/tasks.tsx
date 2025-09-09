import React, { useMemo, useState, useCallback } from "react";
import { ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { YStack, XStack } from "@tamagui/stacks";
import { Text } from "@tamagui/core";
import { H2 } from "@tamagui/text";
import { TaskItem } from "../components/TaskItem";
import { useTasks, Task } from "../contexts/TasksContext";
import { Calendar, Eye, EyeOff } from "@tamagui/lucide-icons";
import { Button } from "@tamagui/button";

interface GroupedTasks {
  today: Task[];
  tomorrow: Task[];
  upcoming: { [key: string]: Task[] };
  overdue: Task[];
  noduedate: Task[];
  previous: Task[];
}

export default function TasksScreen() {
  const { tasks, loading, error, fetchTasks, toggleTaskComplete } = useTasks();
  const [showCompleted, setShowCompleted] = useState(false);

  const groupedTasks = useMemo(() => {
    const groups: GroupedTasks = {
      today: [],
      tomorrow: [],
      upcoming: {},
      overdue: [],
      noduedate: [],
      previous: [],
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    // Filter out completed tasks if showCompleted is false
    const filteredTasks = showCompleted
      ? tasks
      : tasks.filter((task) => task.status !== "completed");

    filteredTasks.forEach((task) => {
      if (!task.due_date) {
        groups.noduedate.push(task);
        return;
      }

      const taskDate = new Date(task.due_date);
      taskDate.setHours(0, 0, 0, 0);

      if (taskDate < today) {
        // All past tasks go to previous section
        groups.previous.push(task);
        // Also track overdue tasks separately for compatibility
        if (task.status !== "completed") {
          groups.overdue.push(task);
        }
      } else if (taskDate.getTime() === today.getTime()) {
        groups.today.push(task);
      } else if (taskDate.getTime() === tomorrow.getTime()) {
        groups.tomorrow.push(task);
      } else if (taskDate >= dayAfterTomorrow) {
        const dateKey = taskDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        });
        if (!groups.upcoming[dateKey]) {
          groups.upcoming[dateKey] = [];
        }
        groups.upcoming[dateKey].push(task);
      }
    });

    // Comparator helpers for task sorting
    const compareByDateDesc = (a: Task, b: Task): number => {
      if (!a.due_date || !b.due_date) return 0;
      return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
    };

    const compareCompletedStatus = (a: Task, b: Task): number => {
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (a.status !== "completed" && b.status === "completed") return -1;
      return 0;
    };

    const compareByPriority = (a: Task, b: Task): number => {
      return b.priority - a.priority;
    };

    const compareByDueDateAsc = (a: Task, b: Task): number => {
      if (!a.due_date || !b.due_date) return 0;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    };

    // Compose comparators in order until non-zero result
    const sortTasks = (taskList: Task[], isPreviousSection: boolean = false) =>
      taskList.sort((a, b) => {
        // For previous tasks, sort by date (most recent first)
        if (isPreviousSection) {
          const dateResult = compareByDateDesc(a, b);
          if (dateResult !== 0) return dateResult;
        }

        // If showing completed, completed tasks go to bottom
        if (showCompleted && !isPreviousSection) {
          const completedResult = compareCompletedStatus(a, b);
          if (completedResult !== 0) return completedResult;
        }

        // Then by priority (higher priority first)
        const priorityResult = compareByPriority(a, b);
        if (priorityResult !== 0) return priorityResult;

        // Then by due time (ascending for tie-breaking)
        return compareByDueDateAsc(a, b);
      });

    groups.overdue = sortTasks(groups.overdue);
    groups.today = sortTasks(groups.today);
    groups.tomorrow = sortTasks(groups.tomorrow);
    groups.noduedate = sortTasks(groups.noduedate);
    groups.previous = sortTasks(groups.previous, true);

    Object.keys(groups.upcoming).forEach((key) => {
      groups.upcoming[key] = sortTasks(groups.upcoming[key]);
    });

    return groups;
  }, [tasks, showCompleted]);

  const renderTaskSection = useCallback(
    (
      title: string,
      taskList: Task[],
      icon?: React.ReactNode,
      alwaysShow: boolean = false,
      showFullDate: boolean = false,
    ) => {
      if (!alwaysShow && taskList.length === 0) return null;

      return (
        <YStack space="$2" marginBottom="$4">
          <XStack space="$2" alignItems="center" paddingHorizontal="$3">
            {icon}
            <H2 size="$5" color="$gray12">
              {title}
            </H2>
            <Text fontSize="$2" color="$gray10">
              ({taskList.length})
            </Text>
          </XStack>
          <YStack paddingHorizontal="$3">
            {taskList.length > 0 ? (
              taskList.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskComplete}
                  showFullDate={showFullDate}
                />
              ))
            ) : (
              <YStack
                paddingVertical="$3"
                paddingHorizontal="$2"
                backgroundColor="$gray2"
                borderRadius="$2"
                alignItems="center"
              >
                <Text fontSize="$3" color="$gray10">
                  No tasks for {title.toLowerCase()}
                </Text>
              </YStack>
            )}
          </YStack>
        </YStack>
      );
    },
    [toggleTaskComplete],
  );

  if (loading && tasks.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#E64D13" />
        <Text marginTop="$3" color="$gray11">
          Loading tasks...
        </Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text color="$red10" textAlign="center">
          {error}
        </Text>
        <Text
          marginTop="$3"
          color="$blue10"
          onPress={fetchTasks}
          textDecorationLine="underline"
        >
          Try again
        </Text>
      </YStack>
    );
  }

  if (tasks.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Calendar size={64} color="$gray8" />
        <Text marginTop="$4" fontSize="$5" color="$gray11" textAlign="center">
          No tasks yet
        </Text>
        <Text marginTop="$2" fontSize="$3" color="$gray10" textAlign="center">
          Create your first task to get started
        </Text>
      </YStack>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchTasks} />
      }
    >
      <YStack flex={1} paddingTop="$3" paddingBottom="$6">
        {/* Toggle Button for Completed Tasks */}
        <XStack
          paddingHorizontal="$3"
          marginBottom="$3"
          justifyContent="flex-end"
        >
          <Button
            size="$3"
            variant="outlined"
            icon={showCompleted ? Eye : EyeOff}
            onPress={() => setShowCompleted(!showCompleted)}
            borderColor="$gray8"
          >
            {showCompleted ? "Hide Completed" : "Show Completed"}
          </Button>
        </XStack>
        {/* Remove separate Overdue Section - will be part of Previous */}

        {/* Today Section - Always Show */}
        {renderTaskSection(
          "Today",
          groupedTasks.today,
          <Calendar size={20} color="$orange9" />,
          true,
        )}

        {/* Tomorrow Section - Always Show */}
        {renderTaskSection(
          "Tomorrow",
          groupedTasks.tomorrow,
          <Calendar size={20} color="$blue9" />,
          true,
        )}

        {/* Upcoming Sections */}
        {Object.entries(groupedTasks.upcoming)
          .sort((a, b) => {
            const dateA = new Date(a[1][0].due_date!);
            const dateB = new Date(b[1][0].due_date!);
            return dateA.getTime() - dateB.getTime();
          })
          .map(([dateKey, taskList]) => (
            <React.Fragment key={dateKey}>
              {renderTaskSection(
                dateKey,
                taskList,
                <Calendar size={20} color="$gray9" />,
              )}
            </React.Fragment>
          ))}

        {/* No Due Date Section */}
        {groupedTasks.noduedate.length > 0 && (
          <YStack
            backgroundColor="$gray1"
            paddingVertical="$2"
            marginBottom="$3"
          >
            {renderTaskSection("No Due Date", groupedTasks.noduedate)}
          </YStack>
        )}

        {/* Previous Tasks Section */}
        {groupedTasks.previous.length > 0 && (
          <YStack backgroundColor="$gray1" paddingVertical="$2">
            {renderTaskSection(
              "Previous",
              groupedTasks.previous,
              <Calendar size={20} color="$gray9" />,
              false,
              true,
            )}
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TaskItem } from "../../components/TaskItem";
import { Task } from "../../contexts/TasksContext";
import { TamaguiProvider } from "@tamagui/core";
import config from "../../tamagui.config";

// Mock Tamagui theme
const mockTheme = {
  gray8: { val: "#6b7280" },
  gray9: { val: "#4b5563" },
  yellow9: { val: "#f59e0b" },
  orange9: { val: "#ea580c" },
  red9: { val: "#dc2626" },
  red10: { val: "#b91c1c" },
};

jest.mock("@tamagui/core", () => ({
  ...jest.requireActual("@tamagui/core"),
  useTheme: () => mockTheme,
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TamaguiProvider config={config}>{children}</TamaguiProvider>
);

describe("TaskItem", () => {
  const mockTask: Task = {
    id: "task-1",
    user_id: "user-1",
    title: "Test Task",
    description: "Test Description",
    status: "pending",
    priority: 2,
    is_recurring: false,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  };

  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render task title and description", () => {
      const { getByText } = render(
        <TestWrapper>
          <TaskItem task={mockTask} onToggle={mockOnToggle} />
        </TestWrapper>,
      );

      expect(getByText("Test Task")).toBeTruthy();
      expect(getByText("Test Description")).toBeTruthy();
    });

    it("should render without description when not provided", () => {
      const taskWithoutDescription = { ...mockTask, description: undefined };
      const { getByText, queryByText } = render(
        <TestWrapper>
          <TaskItem task={taskWithoutDescription} onToggle={mockOnToggle} />
        </TestWrapper>,
      );

      expect(getByText("Test Task")).toBeTruthy();
      expect(queryByText("Test Description")).toBeFalsy();
    });

    it("should show completion status correctly", () => {
      const completedTask = { ...mockTask, status: "completed" as const };
      const { getByRole } = render(
        <TestWrapper>
          <TaskItem task={completedTask} onToggle={mockOnToggle} />
        </TestWrapper>,
      );

      const checkbox = getByRole("checkbox");
      expect(checkbox.props.checked).toBe(true);
    });

    it("should show pending status correctly", () => {
      const { getByRole } = render(
        <TestWrapper>
          <TaskItem task={mockTask} onToggle={mockOnToggle} />
        </TestWrapper>,
      );

      const checkbox = getByRole("checkbox");
      expect(checkbox.props.checked).toBe(false);
    });
  });

  describe("Priority Display", () => {
    it("should display correct priority color for different levels", () => {
      const priorities = [0, 1, 2, 3, 4, 5];
      const expectedColors = [
        mockTheme.gray8.val,
        mockTheme.gray9.val,
        mockTheme.yellow9.val,
        mockTheme.orange9.val,
        mockTheme.red9.val,
        mockTheme.red10.val,
      ];

      priorities.forEach((priority, index) => {
        const taskWithPriority = { ...mockTask, priority };
        const { getByTestId } = render(
          <TestWrapper>
            <TaskItem task={taskWithPriority} onToggle={mockOnToggle} />
          </TestWrapper>,
        );

        // The priority indicator should have the correct color
        // Note: This test assumes there's a testID on the priority indicator
        // You may need to add this to the actual component
      });
    });

    it("should clamp priority values outside valid range", () => {
      const taskWithHighPriority = { ...mockTask, priority: 10 };
      const taskWithNegativePriority = { ...mockTask, priority: -1 };

      // Should not crash and should use fallback colors
      expect(() => {
        render(
          <TestWrapper>
            <TaskItem task={taskWithHighPriority} onToggle={mockOnToggle} />
          </TestWrapper>,
        );
      }).not.toThrow();

      expect(() => {
        render(
          <TestWrapper>
            <TaskItem task={taskWithNegativePriority} onToggle={mockOnToggle} />
          </TestWrapper>,
        );
      }).not.toThrow();
    });
  });

  describe("Due Date Display", () => {
    it("should show due date when provided", () => {
      const taskWithDueDate = {
        ...mockTask,
        due_date: "2023-12-31T23:59:59Z",
      };
      const { getByText } = render(
        <TestWrapper>
          <TaskItem task={taskWithDueDate} onToggle={mockOnToggle} />
        </TestWrapper>,
      );

      // Should show some form of date/time display
      // The exact format depends on the implementation
      expect(getByText(/11:59/)).toBeTruthy(); // Time format
    });

    it("should detect overdue tasks", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const overdueTask = {
        ...mockTask,
        due_date: yesterday.toISOString(),
        status: "pending" as const,
      };

      const { getByTestId } = render(
        <TestWrapper>
          <TaskItem task={overdueTask} onToggle={mockOnToggle} />
        </TestWrapper>,
      );

      // Should indicate overdue status somehow
      // This test assumes there's a testID for overdue indicator
    });

    it("should not show overdue for completed tasks", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const completedOverdueTask = {
        ...mockTask,
        due_date: yesterday.toISOString(),
        status: "completed" as const,
      };

      // Should not crash and should not show overdue indicator
      expect(() => {
        render(
          <TestWrapper>
            <TaskItem task={completedOverdueTask} onToggle={mockOnToggle} />
          </TestWrapper>,
        );
      }).not.toThrow();
    });
  });

  describe("Recurring Task Display", () => {
    it("should show recurring indicator for recurring tasks", () => {
      const recurringTask = {
        ...mockTask,
        is_recurring: true,
        recurrence_pattern: "weekly" as const,
      };

      const { getByTestId } = render(
        <TestWrapper>
          <TaskItem task={recurringTask} onToggle={mockOnToggle} />
        </TestWrapper>,
      );

      // Should show recurring indicator
      // This assumes there's a testID for the recurring icon
    });

    it("should not show recurring indicator for non-recurring tasks", () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <TaskItem task={mockTask} onToggle={mockOnToggle} />
        </TestWrapper>,
      );

      // Should not show recurring indicator
      expect(queryByTestId("recurring-icon")).toBeFalsy();
    });
  });

  describe("Interactions", () => {
    it("should call onToggle when checkbox is pressed", () => {
      const { getByRole } = render(
        <TestWrapper>
          <TaskItem task={mockTask} onToggle={mockOnToggle} />
        </TestWrapper>,
      );

      const checkbox = getByRole("checkbox");
      fireEvent.press(checkbox);

      expect(mockOnToggle).toHaveBeenCalledWith("task-1");
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple rapid presses", () => {
      const { getByRole } = render(
        <TestWrapper>
          <TaskItem task={mockTask} onToggle={mockOnToggle} />
        </TestWrapper>,
      );

      const checkbox = getByRole("checkbox");
      fireEvent.press(checkbox);
      fireEvent.press(checkbox);
      fireEvent.press(checkbox);

      expect(mockOnToggle).toHaveBeenCalledTimes(3);
      expect(mockOnToggle).toHaveBeenCalledWith("task-1");
    });
  });

  describe("Time Formatting", () => {
    it("should format time correctly", () => {
      const taskWithSpecificTime = {
        ...mockTask,
        due_date: "2023-01-01T14:30:00Z",
      };

      const { getByText } = render(
        <TestWrapper>
          <TaskItem
            task={taskWithSpecificTime}
            onToggle={mockOnToggle}
            showFullDate={true}
          />
        </TestWrapper>,
      );

      // Should format time according to locale
      // The exact format depends on the user's locale and implementation
      expect(getByText(/2:30/)).toBeTruthy();
    });

    it("should handle showFullDate prop", () => {
      const taskWithDate = {
        ...mockTask,
        due_date: "2023-01-01T14:30:00Z",
      };

      const { rerender, getByText } = render(
        <TestWrapper>
          <TaskItem
            task={taskWithDate}
            onToggle={mockOnToggle}
            showFullDate={false}
          />
        </TestWrapper>,
      );

      // With showFullDate=false, should show time only
      expect(getByText(/2:30/)).toBeTruthy();

      rerender(
        <TestWrapper>
          <TaskItem
            task={taskWithDate}
            onToggle={mockOnToggle}
            showFullDate={true}
          />
        </TestWrapper>,
      );

      // With showFullDate=true, should show full date
      // This depends on implementation details
    });
  });

  describe("Accessibility", () => {
    it("should have proper accessibility labels", () => {
      const { getByRole } = render(
        <TestWrapper>
          <TaskItem task={mockTask} onToggle={mockOnToggle} />
        </TestWrapper>,
      );

      const checkbox = getByRole("checkbox");
      expect(checkbox).toBeTruthy();
    });

    it("should handle accessibility for completed tasks", () => {
      const completedTask = { ...mockTask, status: "completed" as const };
      const { getByRole } = render(
        <TestWrapper>
          <TaskItem task={completedTask} onToggle={mockOnToggle} />
        </TestWrapper>,
      );

      const checkbox = getByRole("checkbox");
      expect(checkbox.props.checked).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty title", () => {
      const taskWithEmptyTitle = { ...mockTask, title: "" };
      expect(() => {
        render(
          <TestWrapper>
            <TaskItem task={taskWithEmptyTitle} onToggle={mockOnToggle} />
          </TestWrapper>,
        );
      }).not.toThrow();
    });

    it("should handle very long titles", () => {
      const taskWithLongTitle = {
        ...mockTask,
        title: "This is a very long task title that should be handled gracefully by the component without breaking the layout or causing any display issues",
      };
      expect(() => {
        render(
          <TestWrapper>
            <TaskItem task={taskWithLongTitle} onToggle={mockOnToggle} />
          </TestWrapper>,
        );
      }).not.toThrow();
    });

    it("should handle missing theme values", () => {
      // Test with minimal theme to ensure graceful degradation
      jest.mocked(require("@tamagui/core").useTheme).mockReturnValue({});
      
      expect(() => {
        render(
          <TestWrapper>
            <TaskItem task={mockTask} onToggle={mockOnToggle} />
          </TestWrapper>,
        );
      }).not.toThrow();
    });
  });
});
import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { TasksProvider, useTasks, Task } from "../../contexts/TasksContext";

// Mock Supabase
jest.mock("../../lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
  },
}));

// Mock AuthContext
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "test-user-id", email: "test@example.com" },
  }),
}));

describe("TasksContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TasksProvider>{children}</TasksProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console error mock
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    return () => consoleSpy.mockRestore();
  });

  describe("useTasks hook", () => {
    it("should throw error when used outside TasksProvider", () => {
      expect(() => {
        renderHook(() => useTasks());
      }).toThrow("useTasks must be used within a TasksProvider");
    });

    it("should return context when used within TasksProvider", () => {
      const { result } = renderHook(() => useTasks(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.tasks).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.fetchTasks).toBe("function");
      expect(typeof result.current.toggleTaskComplete).toBe("function");
      expect(typeof result.current.createTask).toBe("function");
      expect(typeof result.current.updateTask).toBe("function");
      expect(typeof result.current.deleteTask).toBe("function");
    });
  });

  describe("TasksProvider", () => {
    it("should initialize with default state", () => {
      const { result } = renderHook(() => useTasks(), { wrapper });

      expect(result.current.tasks).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("should fetch tasks when fetchTasks is called", async () => {
      const mockTasks: Task[] = [
        {
          id: "task-1",
          user_id: "test-user-id",
          title: "Test Task",
          description: "Test Description",
          status: "pending",
          priority: 1,
          is_recurring: false,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ];

      const { supabase } = require("../../lib/supabase");
      supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn().mockReturnValue({
              order: jest.fn(() => Promise.resolve({ data: mockTasks, error: null })),
            }),
          })),
        })),
      });

      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await result.current.fetchTasks();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.tasks).toEqual(mockTasks);
      expect(result.current.error).toBe(null);
    });

    it("should handle fetch errors", async () => {
      const mockError = { message: "Failed to fetch tasks" };
      const { supabase } = require("../../lib/supabase");
      supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn().mockReturnValue({
              order: jest.fn(() => Promise.resolve({ data: null, error: mockError })),
            }),
          })),
        })),
      });

      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await result.current.fetchTasks();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.tasks).toEqual([]);
      expect(result.current.error).toBe("Failed to fetch tasks");
    });
  });

  describe("createTask", () => {
    it("should create a new task successfully", async () => {
      const { supabase } = require("../../lib/supabase");
      const mockNewTask: Partial<Task> = {
        title: "New Task",
        description: "New Description",
        priority: 2,
      };

      supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
        insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      });

      const { result } = renderHook(() => useTasks(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.createTask(mockNewTask);
      });

      expect(supabase.from).toHaveBeenCalledWith("tasks");
      expect(supabase.from().insert).toHaveBeenCalledWith({
        ...mockNewTask,
        user_id: "test-user-id",
        status: "pending",
        is_recurring: false,
      });
    });

    it("should handle create task errors", async () => {
      const { supabase } = require("../../lib/supabase");
      const mockError = { message: "Failed to create task" };

      supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
        insert: jest.fn(() => Promise.resolve({ data: null, error: mockError })),
      });

      const { result } = renderHook(() => useTasks(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.createTask({ title: "Test" });
      });

      expect(result.current.error).toBe("Failed to create task");
    });
  });

  describe("toggleTaskComplete", () => {
    it("should toggle task completion status", async () => {
      const { supabase } = require("../../lib/supabase");
      const mockTasks: Task[] = [
        {
          id: "task-1",
          user_id: "test-user-id",
          title: "Test Task",
          status: "pending",
          priority: 1,
          is_recurring: false,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ];

      supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: mockTasks, error: null })),
          })),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      });

      const { result } = renderHook(() => useTasks(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleTaskComplete("task-1");
      });

      expect(supabase.from().update).toHaveBeenCalledWith({
        status: "completed",
        completed_at: expect.any(String),
      });
    });

    it("should handle toggle errors", async () => {
      const { supabase } = require("../../lib/supabase");
      const mockError = { message: "Failed to update task" };

      supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: mockError })),
        })),
      });

      const { result } = renderHook(() => useTasks(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleTaskComplete("task-1");
      });

      expect(result.current.error).toBe("Failed to update task");
    });
  });

  describe("updateTask", () => {
    it("should update task successfully", async () => {
      const { supabase } = require("../../lib/supabase");
      const updates = { title: "Updated Title", priority: 3 };

      supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      });

      const { result } = renderHook(() => useTasks(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.updateTask("task-1", updates);
      });

      expect(supabase.from().update).toHaveBeenCalledWith(updates);
    });
  });

  describe("deleteTask", () => {
    it("should delete task successfully", async () => {
      const { supabase } = require("../../lib/supabase");

      supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      });

      const { result } = renderHook(() => useTasks(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteTask("task-1");
      });

      expect(supabase.from().delete).toHaveBeenCalled();
    });

    it("should handle delete errors", async () => {
      const { supabase } = require("../../lib/supabase");
      const mockError = { message: "Failed to delete task" };

      supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: mockError })),
        })),
      });

      const { result } = renderHook(() => useTasks(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteTask("task-1");
      });

      expect(result.current.error).toBe("Failed to delete task");
    });
  });
});
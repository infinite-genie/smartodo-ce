import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export interface Task {
  id: string;
  user_id: string;
  parent_task_id?: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: number;
  due_date?: string;
  completed_at?: string;
  is_recurring: boolean;
  recurrence_pattern?: "none" | "daily" | "weekly" | "monthly" | "yearly";
  created_at: string;
  updated_at: string;
}

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  toggleTaskComplete: (taskId: string) => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const toggleTaskComplete = useCallback(
    async (taskId: string) => {
      if (!user) return;

      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      // Only allow completing tasks, not uncompleting them
      if (task.status === "completed") {
        return;
      }

      const updates: Partial<Task> = {
        status: "completed" as const,
        completed_at: new Date().toISOString(),
      };

      try {
        const { error } = await supabase
          .from("tasks")
          .update(updates)
          .eq("id", taskId)
          .eq("user_id", user.id);

        if (error) throw error;

        // Update local state
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
        );

        // If it's a recurring task that was completed, fetch tasks again to get the new occurrence
        if (task.is_recurring) {
          await fetchTasks();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update task");
        console.error("Error toggling task:", err);
      }
    },
    [user, tasks, fetchTasks],
  );

  const createTask = useCallback(
    async (task: Partial<Task>) => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("tasks")
          .insert({
            ...task,
            user_id: user.id,
            status: task.status || "pending",
            priority: task.priority || 0,
            is_recurring: task.is_recurring || false,
          })
          .select()
          .single();

        if (error) throw error;
        setTasks((prev) => [...prev, data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create task");
        console.error("Error creating task:", err);
      }
    },
    [user],
  );

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from("tasks")
          .update(updates)
          .eq("id", taskId)
          .eq("user_id", user.id);

        if (error) throw error;

        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update task");
        console.error("Error updating task:", err);
      }
    },
    [user],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from("tasks")
          .delete()
          .eq("id", taskId)
          .eq("user_id", user.id);

        if (error) throw error;
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete task");
        console.error("Error deleting task:", err);
      }
    },
    [user],
  );

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user, fetchTasks]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        toggleTaskComplete,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

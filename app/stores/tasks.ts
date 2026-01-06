import { defineStore } from "pinia";

export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>([]);
  const statusFilter = ref<TaskStatus | null>(null);

  const fetchTasks = async () => {
    // Add artificial delay for testing loading state
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      const data = await $fetch<Task[]>("/api/tasks");
      tasks.value = data;
      return data;
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      // rethrow so useAsyncData on the page gets the error state
      throw err;
    }
  };

  const fetchTaskById = async (id: number) => {
    // Add artificial delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await $fetch<Task>(`/api/tasks/${id}`);
  };

  const updateTask = async (id: number, patch: Partial<Task>) => {
    // Artificial delay is handled by the server for this one, but we can add UI delay if needed.
    // The server has 2000ms delay.
    const updated = await $fetch<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: patch,
    });

    // Update local state
    const index = tasks.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks.value[index] = updated;
    }

    return updated;
  };

  const filteredTasks = computed(() => {
    if (!statusFilter.value) return tasks.value;
    return tasks.value.filter((task) => task.status === statusFilter.value);
  });

  const setFilter = (status: TaskStatus | null) => {
    statusFilter.value = status;
  };

  return {
    tasks,
    statusFilter,
    fetchTasks,
    fetchTaskById,
    updateTask,
    filteredTasks,
    setFilter,
  };
});

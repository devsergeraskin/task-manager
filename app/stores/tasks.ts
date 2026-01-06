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
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
    filteredTasks,
    setFilter,
  };
});

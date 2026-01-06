<template>
  <div
    class="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
  >
    <div class="flex justify-between items-start mb-3">
      <h3
        class="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors flex-1 mr-2"
      >
        {{ task.title }}
      </h3>
      <div class="flex items-center gap-2">
        <span
          :class="statusClasses"
          class="px-2.5 py-0.5 text-xs font-bold rounded-full capitalize"
        >
          {{ formattedStatus }}
        </span>
        <TaskStatusDropdown
          :current-status="task.status"
          :task-id="task.id"
          @update="handleStatusUpdate"
          @click.prevent
        />
      </div>
    </div>
    <div class="mt-2 flex justify-end">
      <NuxtLink
        :to="`/tasks/${task.id}`"
        class="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 group/link"
      >
        View Details
        <span class="group-hover/link:translate-x-0.5 transition-transform"
          >&rarr;</span
        >
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task, TaskStatus } from "~/stores/tasks";
import { useTasksStore } from "~/stores/tasks";

const props = defineProps<{
  task: Task;
}>();

const store = useTasksStore();

const handleStatusUpdate = async (status: TaskStatus) => {
  try {
    await store.updateTask(props.task.id, { status });
  } catch (error) {
    console.error("Failed to update status", error);
    alert("Failed to update status");
  }
};

const formattedStatus = computed(() => {
  return props.task.status.replace("-", " ");
});

const statusClasses = computed(() => {
  switch (props.task.status) {
    case "done":
      return "bg-green-100 text-green-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "todo":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
});
</script>

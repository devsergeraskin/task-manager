<template>
  <div
    class="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
  >
    <div class="flex justify-between items-start">
      <h3 class="font-medium text-lg text-gray-900">{{ task.title }}</h3>
      <span
        :class="statusClasses"
        class="px-2 py-1 text-xs font-semibold rounded-full capitalize"
      >
        {{ formattedStatus }}
      </span>
    </div>
    <div class="mt-4 flex justify-end">
      <NuxtLink
        :to="`/tasks/${task.id}`"
        class="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        View Details &rarr;
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/stores/tasks";

const props = defineProps<{
  task: Task;
}>();

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

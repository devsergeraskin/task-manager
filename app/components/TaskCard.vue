<template>
  <article
    class="relative rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500/40"
  >
    <!-- top accent by status -->
    <div :class="accentClasses" class="h-1 w-full rounded-t-2xl" />

    <div class="p-4 sm:p-5">
      <!-- Header -->
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <div class="flex items-start gap-2">
            <h3
              class="min-w-0 truncate text-base sm:text-lg font-semibold text-gray-900"
              :title="task.title"
            >
              {{ task.title }}
            </h3>

            <span
              :class="dotClasses"
              class="mt-2 inline-block h-2 w-2 shrink-0 rounded-full"
              aria-hidden="true"
            />
          </div>

          <p class="mt-1 text-xs sm:text-sm text-gray-500">
            Task • <span class="capitalize">{{ formattedStatus }}</span>
          </p>
        </div>

        <!-- Right side: badge + dropdown -->
        <div class="flex items-center gap-2">
          <span
            :class="statusClasses"
            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset"
          >
            <span :class="dotClasses" class="h-1.5 w-1.5 rounded-full" />
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

      <!-- Footer -->
      <div class="mt-4 flex items-center justify-between">
        <span
          class="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-600 ring-1 ring-gray-200"
        >
          <span aria-hidden="true">🗂️</span>
          {{ statusLabel }}
        </span>

        <!-- ✅ only this opens the task -->
        <NuxtLink
          :to="`/tasks/${task.id}`"
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
        >
          View details
          <span class="text-white/90" aria-hidden="true">→</span>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Task, TaskStatus } from "~/stores/tasks";
import { useTasksStore } from "~/stores/tasks";

const props = defineProps<{ task: Task }>();

const store = useTasksStore();

const handleStatusUpdate = async (status: TaskStatus) => {
  try {
    await store.updateTask(props.task.id, { status });
  } catch (error) {
    console.error("Failed to update status", error);
    alert("Failed to update status");
  }
};

const formattedStatus = computed(() => props.task.status.replace("-", " "));

const statusLabel = computed(() => {
  switch (props.task.status) {
    case "done":
      return "Completed";
    case "in-progress":
      return "In progress";
    case "todo":
      return "To do";
    default:
      return "Task";
  }
});

const statusClasses = computed(() => {
  switch (props.task.status) {
    case "done":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "in-progress":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "todo":
      return "bg-gray-50 text-gray-700 ring-gray-200";
    default:
      return "bg-gray-50 text-gray-700 ring-gray-200";
  }
});

const dotClasses = computed(() => {
  switch (props.task.status) {
    case "done":
      return "bg-emerald-500";
    case "in-progress":
      return "bg-blue-500";
    case "todo":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
});

const accentClasses = computed(() => {
  switch (props.task.status) {
    case "done":
      return "bg-emerald-500/70";
    case "in-progress":
      return "bg-blue-500/70";
    case "todo":
      return "bg-gray-300";
    default:
      return "bg-gray-300";
  }
});
</script>

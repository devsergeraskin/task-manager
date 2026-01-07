<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
  >
    <!-- Top bar -->
    <div
      class="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 sm:px-6"
    >
      <div class="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <Icon icon="ph:table" width="18" height="18" class="text-gray-500" />
        Tasks table
      </div>

      <div class="flex items-center gap-2 text-xs text-gray-500">
        <span class="rounded-full bg-white px-2 py-1 ring-1 ring-gray-200">
          {{ tasks.length }} items
        </span>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:px-6"
            >
              #ID
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:px-6"
            >
              Task
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:px-6"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider sm:px-6"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="task in tasks"
            :key="task.id"
            class="group hover:bg-gray-50/60 transition-colors"
          >
            <td class="px-4 py-4 whitespace-nowrap sm:px-6">
              <span class="inline-flex items-center gap-2">
                <!-- <span
                  class="h-2 w-2 rounded-full"
                  :class="dotClasses(task.status)"
                /> -->
                <span class="text-sm text-gray-500 font-mono">{{
                  task.id
                }}</span>
              </span>
            </td>

            <td class="px-4 py-4 sm:px-6">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p
                    class="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors truncate"
                    :title="task.title"
                  >
                    {{ task.title }}
                  </p>
                  <p
                    class="mt-0.5 text-xs text-gray-500 truncate max-w-[34ch] sm:max-w-[52ch]"
                    :title="task.description || 'No description'"
                  >
                    {{ task.description || "No description" }}
                  </p>
                </div>

                <!-- quick status label (optional) -->
                <span
                  class="hidden sm:inline-flex shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ring-inset min-w-[80px] justify-center"
                  :class="statusPillClasses(task.status)"
                >
                  {{ task.status.replace("-", " ") }}
                </span>
              </div>
            </td>

            <td class="px-4 py-4 whitespace-nowrap sm:px-6">
              <div class="items-center gap-2">
                <TaskStatusDropdown
                  :current-status="task.status"
                  :task-id="task.id"
                  :show-label="true"
                  @update="(s) => handleStatusUpdate(task.id, s)"
                />
              </div>
            </td>

            <td
              class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium sm:px-6"
            >
              <div class="flex items-center justify-end gap-2">
                <button
                  @click="handleDelete(task.id)"
                  class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete task"
                >
                  <Icon icon="ph:trash" width="18" height="18" color="red" />
                </button>

                <NuxtLink
                  :to="`/tasks/${task.id}`"
                  class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                >
                  View
                  <span class="text-white/90" aria-hidden="true">→</span>
                </NuxtLink>
              </div>
            </td>
          </tr>

          <!-- Empty -->
          <tr v-if="tasks.length === 0">
            <td colspan="4" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center gap-3">
                <div
                  class="rounded-full bg-gray-50 p-4 text-gray-400 ring-1 ring-gray-200"
                >
                  <Icon icon="ph:clipboard-text" width="36" height="36" />
                </div>
                <p class="text-gray-900 font-semibold">No tasks</p>
                <p class="text-sm text-gray-500">
                  Create a task to see it here.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span>Tip: change status directly from the dropdown.</span>
        <span class="hidden sm:inline">Showing {{ tasks.length }} tasks</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { Task, TaskStatus } from "~/stores/tasks";
import { useTasksStore } from "~/stores/tasks";

const props = defineProps<{ tasks: Task[] }>();

const store = useTasksStore();

const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this task?")) return;
  try {
    await store.deleteTask(id);
  } catch (error) {
    console.error("Failed to delete task", error);
    alert("Failed to delete task");
  }
};

const handleStatusUpdate = async (id: number, status: TaskStatus) => {
  try {
    await store.updateTask(id, { status });
  } catch (error) {
    console.error("Failed to update status", error);
    alert("Failed to update status");
  }
};

const dotClasses = (status: TaskStatus) => {
  switch (status) {
    case "done":
      return "bg-emerald-500";
    case "in-progress":
      return "bg-blue-500";
    case "todo":
    default:
      return "bg-gray-400";
  }
};

const statusPillClasses = (status: TaskStatus) => {
  switch (status) {
    case "done":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "in-progress":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "todo":
    default:
      return "bg-gray-50 text-gray-700 ring-gray-200";
  }
};
</script>

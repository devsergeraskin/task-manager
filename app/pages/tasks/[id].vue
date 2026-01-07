<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <!-- Back Link -->
      <NuxtLink
        to="/tasks"
        class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-white hover:text-indigo-700 transition ring-1 ring-transparent hover:ring-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 mb-6"
      >
        <Icon icon="ph:arrow-left" width="18" height="18" />
        Back to Tasks
      </NuxtLink>

      <!-- Loading -->
      <div
        v-if="status === 'pending'"
        class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex justify-center"
      >
        <LoadingSpinner />
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="bg-red-50 text-red-700 p-8 rounded-2xl text-center ring-1 ring-red-200"
      >
        <Icon
          icon="ph:warning-octagon"
          width="44"
          height="44"
          class="mx-auto mb-4 opacity-80"
        />
        <h2 class="text-xl font-bold mb-2">Task Not Found</h2>
        <p class="mb-6 text-sm text-red-700/90">
          The task you are looking for does not exist or an error occurred.
        </p>
        <NuxtLink
          to="/tasks"
          class="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
        >
          <Icon icon="ph:arrow-left" width="18" height="18" />
          Return to List
        </NuxtLink>
      </div>

      <!-- Content -->
      <div
        v-else-if="task"
        class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <!-- Top accent -->
        <div :class="accentClasses" class="h-1 w-full" />

        <div class="p-6 sm:p-8">
          <div class="flex justify-between items-start mb-6 gap-4">
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span class="font-mono text-gray-400">#{{ task.id }}</span>
            </div>

            <!-- Status badge (visible only when not editing or just as context?) Matches previous layout where badge was top right -->
            <span
              v-if="!isEditing"
              :class="statusClasses"
              class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset"
            >
              <Icon :icon="statusIcon" width="14" height="14" />
              {{ task.status.replace("-", " ") }}
            </span>
          </div>

          <!-- Edit Mode: Reused Form -->
          <div v-if="isEditing">
            <TaskForm
              :initial-task="task"
              label-submit="Save Changes"
              :is-saving="isSaving"
              @save="handleSave"
              @cancel="isEditing = false"
            />
          </div>

          <!-- View Mode -->
          <template v-else>
            <h1 class="text-3xl font-bold text-gray-900 mb-4">
              {{ task.title }}
            </h1>

            <div class="prose prose-indigo max-w-none text-gray-700">
              <p v-if="task.description">{{ task.description }}</p>
              <p v-else class="text-gray-400 italic">
                No description provided.
              </p>
            </div>
          </template>
        </div>

        <!-- Footer actions (only for view mode now, form handles its own logic) -->
        <div
          v-if="!isEditing"
          class="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-200 flex justify-end gap-3"
        >
          <button
            @click="isEditing = true"
            class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
          >
            <Icon icon="ph:pencil-simple" />
            Edit Task
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTasksStore, type TaskStatus } from "~/stores/tasks";
import { Icon } from "@iconify/vue";

definePageMeta({
  middleware: ["validate-id"],
});

const route = useRoute();
const store = useTasksStore();
const taskId = Number(route.params.id);

const {
  data: task,
  status,
  error,
  refresh,
} = await useAsyncData(`task-${taskId}`, () => store.fetchTaskById(taskId));

const isEditing = ref(false);
const isSaving = ref(false);

const handleSave = async (updatedTask: {
  title: string;
  description: string;
  status: TaskStatus;
}) => {
  isSaving.value = true;
  try {
    const updated = await store.updateTask(taskId, updatedTask);
    task.value = updated;
    // console.log(updated);
    isEditing.value = false;
  } catch (err) {
    console.error("Failed to save task:", err);
    alert("Failed to save changes.");
  } finally {
    isSaving.value = false;
  }
};

/** Badge Helpers (for view mode) */
const statusClasses = computed(() => {
  if (!task.value) return "bg-gray-50 text-gray-700 ring-gray-200";
  switch (task.value.status) {
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

const accentClasses = computed(() => {
  if (!task.value) return "bg-gray-300";
  switch (task.value.status) {
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

const statusIcon = computed(() => {
  if (!task.value) return "ph:circle";
  switch (task.value.status) {
    case "done":
      return "ph:check-circle";
    case "in-progress":
      return "ph:clock";
    case "todo":
      return "ph:circle";
    default:
      return "ph:circle";
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <!-- Back Link (styled like the new UI) -->
      <NuxtLink
        to="/tasks"
        class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-white hover:text-indigo-700 transition ring-1 ring-transparent hover:ring-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 mb-6"
      >
        <Icon icon="ph:arrow-left" width="18" height="18" />
        Back to Tasks
      </NuxtLink>

      <!-- Loading State -->
      <div
        v-if="status === 'pending'"
        class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex justify-center"
      >
        <LoadingSpinner />
      </div>

      <!-- Error State -->
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
        <!-- Top accent (matches TaskCard) -->
        <div :class="accentClasses" class="h-1 w-full" />

        <div class="p-6 sm:p-8">
          <div class="flex justify-between items-start mb-6 gap-4">
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span class="font-mono text-gray-400">#{{ task.id }}</span>
            </div>

            <!-- Status badge -->
            <span
              :class="statusClasses"
              class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset"
            >
              <span :class="dotClasses" class="h-1.5 w-1.5 rounded-full" />
              <Icon :icon="statusIcon" width="14" height="14" />
              {{ task.status.replace("-", " ") }}
            </span>
          </div>

          <!-- Edit mode -->
          <div v-if="isEditing" class="space-y-5">
            <div>
              <label
                for="title"
                class="block text-sm font-semibold text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                v-model="editedTitle"
                type="text"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base sm:text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300"
                placeholder="Enter task title"
                ref="titleInput"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                Status
              </label>
              <TaskStatusDropdown
                :current-status="editedStatus"
                :show-label="true"
                @update="(s) => (editedStatus = s)"
              />
            </div>

            <div>
              <label
                for="description"
                class="block text-sm font-semibold text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                v-model="editedDescription"
                rows="5"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300"
                placeholder="Add a detailed description..."
              />
            </div>
          </div>

          <!-- View mode -->
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

        <!-- Footer actions (match new button styles) -->
        <div
          class="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-200 flex justify-end gap-3"
        >
          <template v-if="isEditing">
            <button
              @click="cancelEditing"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
              :disabled="isSaving"
            >
              Cancel
            </button>

            <button
              @click="saveTask"
              class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="isSaving"
            >
              <Icon icon="ph:spinner" class="animate-spin" v-if="isSaving" />
              <Icon icon="ph:check" v-else />
              {{ isSaving ? "Saving..." : "Save Changes" }}
            </button>
          </template>

          <button
            v-else
            @click="startEditing"
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
import { nextTick } from "vue";

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
const editedTitle = ref("");
const editedDescription = ref("");
const editedStatus = ref<TaskStatus>("todo");
const isSaving = ref(false);
const titleInput = ref<HTMLInputElement | null>(null);

const startEditing = () => {
  if (task.value) {
    editedTitle.value = task.value.title;
    editedDescription.value = task.value.description || "";
    editedStatus.value = task.value.status;
    isEditing.value = true;
    nextTick(() => titleInput.value?.focus());
  }
};

const cancelEditing = () => {
  isEditing.value = false;
  editedTitle.value = "";
  editedDescription.value = "";
};

const saveTask = async () => {
  if (!editedTitle.value.trim() || !task.value) return;

  isSaving.value = true;
  try {
    await store.updateTask(taskId, {
      title: editedTitle.value,
      description: editedDescription.value,
      status: editedStatus.value,
    });
    await refresh();
    isEditing.value = false;
  } catch (err) {
    console.error("Failed to save task:", err);
    alert("Failed to save changes. Please try again.");
  } finally {
    isSaving.value = false;
  }
};

/** Badge + accent + dot (same palette as TaskCard) */
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

const dotClasses = computed(() => {
  if (!task.value) return "bg-gray-400";
  switch (task.value.status) {
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

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <!-- Back Link -->
      <NuxtLink
        to="/tasks"
        class="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors font-medium"
      >
        <Icon icon="ph:arrow-left" class="mr-2" />
        Back to Tasks
      </NuxtLink>

      <!-- Loading State -->
      <div
        v-if="status === 'pending'"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex justify-center"
      >
        <LoadingSpinner />
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 text-red-600 p-8 rounded-xl text-center border border-red-100"
      >
        <Icon
          icon="ph:warning-octagon"
          width="48"
          height="48"
          class="mx-auto mb-4 opacity-80"
        />
        <h2 class="text-xl font-bold mb-2">Task Not Found</h2>
        <p class="mb-6 opacity-90">
          The task you are looking for does not exist or an error occurred.
        </p>
        <NuxtLink
          to="/tasks"
          class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium inline-block"
        >
          Return to List
        </NuxtLink>
      </div>

      <!-- Content -->
      <div
        v-else-if="task"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div class="p-8">
          <div class="flex justify-between items-start mb-6">
            <span class="text-sm font-mono text-gray-400">#{{ task.id }}</span>
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5',
                  statusClasses,
                ]"
              >
                <Icon :icon="statusIcon" width="14" height="14" />
                {{ task.status.replace("-", " ") }}
              </span>
              <TaskStatusDropdown
                :current-status="task.status"
                :task-id="task.id"
                @update="handleStatusUpdate"
                @click.prevent
              />
            </div>
          </div>

          <div v-if="isEditing" class="mb-6">
            <label for="title" class="sr-only">Task Title</label>
            <input
              id="title"
              v-model="editedTitle"
              type="text"
              class="w-full text-3xl font-bold text-gray-900 border-b-2 border-indigo-500 py-2 focus:outline-none focus:border-indigo-600 bg-transparent"
              placeholder="Enter task title"
              @keyup.enter="saveTask"
              @keyup.esc="cancelEditing"
              ref="titleInput"
            />
          </div>
          <h1 v-else class="text-3xl font-bold text-gray-900 mb-6">
            {{ task.title }}
          </h1>

          <div v-if="isEditing">
            <label for="description" class="sr-only">Description</label>
            <textarea
              id="description"
              v-model="editedDescription"
              rows="4"
              class="w-full text-base text-gray-600 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
              placeholder="Add a detailed description..."
            ></textarea>
          </div>
          <div v-else class="prose prose-indigo max-w-none text-gray-600">
            <p v-if="task.description">{{ task.description }}</p>
            <p v-else class="text-gray-400 italic">No description provided.</p>
          </div>
        </div>

        <div
          class="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-end gap-3"
        >
          <template v-if="isEditing">
            <button
              @click="cancelEditing"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              :disabled="isSaving"
            >
              Cancel
            </button>
            <button
              @click="saveTask"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2"
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
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2"
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

// Use useAsyncData to fetch task details
const {
  data: task,
  status,
  error,
  refresh,
} = await useAsyncData(`task-${taskId}`, () => store.fetchTaskById(taskId));

const isEditing = ref(false);
const editedTitle = ref("");
const editedDescription = ref("");
const isSaving = ref(false);
const titleInput = ref<HTMLInputElement | null>(null);

const startEditing = () => {
  if (task.value) {
    editedTitle.value = task.value.title;
    editedDescription.value = task.value.description || "";
    isEditing.value = true;
    nextTick(() => {
      titleInput.value?.focus();
    });
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

const handleStatusUpdate = async (status: TaskStatus) => {
  try {
    await store.updateTask(taskId, { status });
    await refresh();
  } catch (error) {
    console.error("Failed to update status", error);
    alert("Failed to update status");
  }
};

const statusClasses = computed(() => {
  if (!task.value) return "";
  switch (task.value.status) {
    case "done":
      return "bg-green-100 text-green-700";
    case "in-progress":
      return "bg-blue-100 text-blue-700";
    case "todo":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
});

const statusIcon = computed(() => {
  if (!task.value) return "";
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

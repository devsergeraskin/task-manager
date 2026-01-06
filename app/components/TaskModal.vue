<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
      @click="close"
    />

    <!-- Modal Content -->
    <div
      class="relative w-full max-w-lg bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden transform transition-all"
    >
      <div
        class="px-6 py-4 border-b border-gray-100 flex items-center justify-between"
      >
        <h3 class="text-lg font-bold text-gray-900">New Task</h3>
        <button
          @click="close"
          class="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-lg hover:bg-gray-50"
        >
          <Icon icon="ph:x" width="20" height="20" />
        </button>
      </div>

      <div class="p-6">
        <TaskForm
          label-submit="Create Task"
          :is-saving="isSaving"
          @save="handleCreate"
          @cancel="close"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useTasksStore, type TaskStatus } from "~/stores/tasks";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "created"): void;
}>();

const store = useTasksStore();
const isSaving = ref(false);

const close = () => {
  emit("close");
};

const handleCreate = async (task: {
  title: string;
  description: string;
  status: TaskStatus;
}) => {
  isSaving.value = true;
  try {
    await store.createTask(task);
    emit("created");
    close();
  } catch (error) {
    console.error("Failed to create task", error);
    alert("Failed to create task");
  } finally {
    isSaving.value = false;
  }
};
</script>

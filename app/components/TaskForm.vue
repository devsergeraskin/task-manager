<template>
  <div class="space-y-5">
    <div>
      <label for="title" class="block text-sm font-semibold text-gray-700 mb-1">
        Title <span class="text-red-500">*</span>
      </label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base sm:text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300"
        placeholder="Enter task title"
        required
        ref="titleInput"
      />
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-1">
        Status
      </label>
      <TaskStatusDropdown
        :current-status="form.status"
        :show-label="true"
        @update="(s) => (form.status = s)"
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
        v-model="form.description"
        rows="5"
        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300"
        placeholder="Add a detailed description..."
      />
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
      <button
        @click="$emit('cancel')"
        class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
        type="button"
        :disabled="isSaving"
      >
        Cancel
      </button>

      <button
        @click="handleSubmit"
        class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
        type="button"
        :disabled="isSaving || !form.title.trim()"
      >
        <Icon icon="ph:spinner" class="animate-spin" v-if="isSaving" />
        <Icon icon="ph:check" v-else />
        {{ isSaving ? "Saving..." : labelSubmit }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task, TaskStatus } from "~/stores/tasks";
import { Icon } from "@iconify/vue";

const props = defineProps<{
  initialTask?: Partial<Task>;
  isSaving?: boolean;
  labelSubmit?: string;
}>();

const emit = defineEmits<{
  (
    e: "save",
    task: { title: string; description: string; status: TaskStatus }
  ): void;
  (e: "cancel"): void;
}>();

const form = reactive({
  title: "",
  description: "",
  status: "todo" as TaskStatus,
});

const titleInput = ref<HTMLInputElement | null>(null);

// Initialize form
watch(
  () => props.initialTask,
  (task) => {
    if (task) {
      form.title = task.title || "";
      form.description = task.description || "";
      form.status = task.status || "todo";
    }
  },
  { immediate: true }
);

onMounted(() => {
  nextTick(() => titleInput.value?.focus());
});

const handleSubmit = () => {
  if (!form.title.trim()) return;

  emit("save", {
    title: form.title,
    description: form.description,
    status: form.status,
  });
};
</script>

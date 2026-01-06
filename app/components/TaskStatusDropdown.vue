<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      :class="[
        'w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors',
        isOpen ? 'bg-gray-100' : '',
      ]"
      title="Change Status"
    >
      <Icon
        icon="ph:pencil-simple"
        class="text-gray-500"
        width="16"
        height="16"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10"
    >
      <button
        v-for="status in statusOptions"
        :key="status.value"
        @click="updateStatus(status.value)"
        class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
        :class="{
          'text-indigo-600 bg-indigo-50': currentStatus === status.value,
        }"
      >
        <Icon :icon="status.icon" width="16" height="16" />
        {{ status.label }}
        <Icon
          v-if="currentStatus === status.value"
          icon="ph:check"
          class="ml-auto"
          width="16"
          height="16"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import {
  type TaskStatus,
  TASK_STATUS_DEFINITIONS,
} from "~/utils/task-constants";
import { onClickOutside } from "@vueuse/core";

const props = defineProps<{
  currentStatus: TaskStatus;
  taskId: number;
}>();

const emit = defineEmits<{
  (e: "update", status: TaskStatus): void;
}>();

const isOpen = ref(false);
const dropdownRef = ref(null);

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});

const statusOptions = TASK_STATUS_DEFINITIONS;

const updateStatus = (status: TaskStatus) => {
  emit("update", status);
  isOpen.value = false;
};
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <!-- Custom Trigger -->
    <div v-if="$slots.default" @click="isOpen = !isOpen" class="cursor-pointer">
      <slot />
    </div>

    <!-- Icon/Compact Mode -->
    <button
      v-else-if="!showLabel"
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

    <!-- Label/Full Mode -->
    <button
      v-else
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
    >
      <div class="flex items-center gap-2">
        <Icon
          :icon="currentStatusConfig?.icon || 'ph:circle'"
          width="16"
          height="16"
        />
        {{ currentStatusConfig?.label || currentStatus }}
      </div>
      <Icon icon="ph:caret-down" class="text-gray-400" />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-full min-w-[12rem] bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10"
      :class="{ 'left-0': showLabel }"
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

const props = withDefaults(
  defineProps<{
    currentStatus: TaskStatus;
    taskId?: number; // Optional now as strictly UI component
    showLabel?: boolean;
  }>(),
  {
    showLabel: false,
  }
);

const emit = defineEmits<{
  (e: "update", status: TaskStatus): void;
}>();

const isOpen = ref(false);
const dropdownRef = ref(null);

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});

const statusOptions = TASK_STATUS_DEFINITIONS;

const currentStatusConfig = computed(() => {
  return statusOptions.find((op) => op.value === props.currentStatus);
});

const updateStatus = (status: TaskStatus) => {
  emit("update", status);
  isOpen.value = false;
};
</script>

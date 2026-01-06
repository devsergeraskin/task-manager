<template>
  <div id="app" v-cloak>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4 max-w-4xl">
        <header class="mb-8 flex items-center gap-3">
          <div class="p-3 bg-indigo-100 rounded-lg text-indigo-600">
            <Icon icon="ph:kanban" width="32" height="32" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-1">Tasks</h1>
            <p class="text-gray-600">Manage and track your project tasks.</p>
          </div>
        </header>

        <!-- Filters -->
        <div class="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            @click="store.setFilter(null)"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2',
              !store.statusFilter
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
            ]"
          >
            <Icon icon="ph:list" width="18" height="18" />
            All Tasks
          </button>

          <button
            @click="store.setFilter('todo')"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize whitespace-nowrap flex items-center gap-2',
              store.statusFilter === 'todo'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
            ]"
          >
            <Icon icon="ph:circle" width="18" height="18" />
            To Do
          </button>

          <button
            @click="store.setFilter('in-progress')"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize whitespace-nowrap flex items-center gap-2',
              store.statusFilter === 'in-progress'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
            ]"
          >
            <Icon
              icon="ph:spinner"
              width="18"
              height="18"
              class="animate-spin-slow"
              v-if="store.statusFilter === 'in-progress'"
            />
            <Icon icon="ph:clock" width="18" height="18" v-else />
            In Progress
          </button>

          <button
            @click="store.setFilter('done')"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize whitespace-nowrap flex items-center gap-2',
              store.statusFilter === 'done'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
            ]"
          >
            <Icon icon="ph:check-circle" width="18" height="18" />
            Done
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="asyncStatus === 'pending'">
          <LoadingSpinner />
        </div>

        <!-- Error State -->
        <div
          v-else-if="asyncError"
          class="bg-red-50 text-red-600 p-8 rounded-lg text-center flex flex-col items-center gap-3"
        >
          <Icon icon="ph:warning-circle" width="48" height="48" />
          <p class="font-medium">
            Failed to load tasks. Please try again later.
          </p>
        </div>

        <!-- Content -->
        <div v-else>
          <div
            v-if="store.filteredTasks.length > 0"
            class="grid gap-4 md:grid-cols-2"
          >
            <TaskCard
              v-for="task in store.filteredTasks"
              :key="task.id"
              :task="task"
            />
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300 flex flex-col items-center gap-4"
          >
            <div class="p-4 bg-gray-50 rounded-full text-gray-400">
              <Icon icon="ph:clipboard-text" width="48" height="48" />
            </div>
            <div>
              <p class="text-gray-900 font-medium text-lg">No tasks found</p>
              <p class="text-gray-500 text-sm mt-1" v-if="store.statusFilter">
                Try changing the filter to see more tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useTasksStore } from "~/stores/tasks";
import { Icon } from "@iconify/vue";

const store = useTasksStore();

// ✅ do NOT top-level await (it blocks SSR render)
const { status, error, execute } = useAsyncData(
  "tasks-page",
  () => store.fetchTasks(),
  {
    immediate: false, // don't run on server render
    server: false, // client only
    lazy: true, // don't block render
  }
);

onMounted(() => {
  execute(); // start fetching after page is painted
});

const asyncStatus = computed(() => status.value);
const asyncError = computed(() => error.value);
</script>

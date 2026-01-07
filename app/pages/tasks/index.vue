<template>
  <div id="app" v-cloak>
    <div class="bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <!-- Header -->
        <header
          class="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <div
              class="p-3 bg-indigo-50 rounded-2xl text-indigo-600 ring-1 ring-indigo-100"
            >
              <Icon icon="ph:kanban" width="30" height="30" />
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900 leading-tight">
                Tasks
              </h1>
              <p class="text-gray-600 mt-1">
                Manage and track your project tasks.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- View Toggle -->
            <div
              class="hidden sm:inline-flex bg-white p-1 rounded-xl shadow-sm border border-gray-200"
            >
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-400 hover:text-gray-600',
                ]"
                title="Grid View"
              >
                <Icon icon="ph:squares-four" width="20" height="20" />
              </button>
              <button
                @click="viewMode = 'table'"
                :class="[
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'table'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-400 hover:text-gray-600',
                ]"
                title="Table View"
              >
                <Icon icon="ph:list-dashes" width="20" height="20" />
              </button>
            </div>

            <!-- Open Modal -->
            <button
              @click="isCreateModalOpen = true"
              class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            >
              <Icon icon="ph:plus" width="18" height="18" />
              <span class="hidden sm:inline">New Task</span>
              <span class="sm:hidden">New</span>
            </button>
          </div>
        </header>

        <!-- Filters (segmented control) -->
        <div class="mb-6">
          <div
            class="inline-flex w-full sm:w-auto items-center gap-1 rounded-2xl bg-white p-1 ring-1 ring-gray-200 shadow-sm"
          >
            <button
              @click="store.setFilter(null)"
              :class="segBtn(!store.statusFilter)"
              type="button"
            >
              <Icon icon="ph:list" width="18" height="18" />
              <span>All</span>
              <span
                class="ml-1 hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                :class="pill(!store.statusFilter)"
              >
                {{ counts.all }}
              </span>
            </button>

            <button
              @click="store.setFilter('todo')"
              :class="segBtn(store.statusFilter === 'todo')"
              type="button"
            >
              <Icon icon="ph:circle" width="18" height="18" />
              <span>To Do</span>
              <span
                class="ml-1 hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                :class="pill(store.statusFilter === 'todo')"
              >
                {{ counts.todo }}
              </span>
            </button>

            <button
              @click="store.setFilter('in-progress')"
              :class="segBtn(store.statusFilter === 'in-progress')"
              type="button"
            >
              <Icon
                icon="ph:spinner"
                width="18"
                height="18"
                class="animate-spin"
                v-if="store.statusFilter === 'in-progress'"
              />
              <Icon icon="ph:clock" width="18" height="18" v-else />
              <span>In Progress</span>
              <span
                class="ml-1 hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                :class="pill(store.statusFilter === 'in-progress')"
              >
                {{ counts.inProgress }}
              </span>
            </button>

            <button
              @click="store.setFilter('done')"
              :class="segBtn(store.statusFilter === 'done')"
              type="button"
            >
              <Icon icon="ph:check-circle" width="18" height="18" />
              <span>Done</span>
              <span
                class="ml-1 hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                :class="pill(store.statusFilter === 'done')"
              >
                {{ counts.done }}
              </span>
            </button>
          </div>

          <!-- subtle helper row -->
          <div
            class="mt-3 flex items-center justify-between text-sm text-gray-600"
          >
            <p>
              <span class="font-semibold text-gray-900">{{
                store.filteredTasks.length
              }}</span>
              tasks
            </p>

            <NuxtLink
              v-if="store.statusFilter"
              to="/tasks"
              @click.prevent="store.setFilter(null)"
              class="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear filter
            </NuxtLink>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="asyncStatus === 'pending'">
          <LoadingSpinner />
        </div>

        <!-- Error -->
        <div
          v-else-if="asyncError"
          class="bg-red-50 text-red-700 p-8 rounded-2xl text-center flex flex-col items-center gap-3 ring-1 ring-red-200"
        >
          <Icon icon="ph:warning-circle" width="44" height="44" />
          <p class="font-semibold">Failed to load tasks</p>
          <p class="text-sm text-red-600/90">Please try again in a moment.</p>
          <button
            type="button"
            class="mt-2 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
            @click="execute()"
          >
            <Icon icon="ph:arrow-counter-clockwise" width="18" height="18" />
            Retry
          </button>
        </div>

        <!-- Content -->
        <div
          class="overflow-y-auto"
          style="max-height: calc(100vh - 400px)"
          v-else
        >
          <div v-if="store.filteredTasks.length > 0">
            <!-- Grid View -->
            <div v-if="viewMode === 'grid'" class="grid gap-4 md:grid-cols-2">
              <TaskCard
                v-for="task in store.filteredTasks"
                :key="task.id"
                :task="task"
              />
            </div>

            <!-- Table View -->
            <TaskTable v-else :tasks="store.filteredTasks" />
          </div>

          <!-- Empty -->
          <div
            v-else
            class="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 flex flex-col items-center gap-4"
          >
            <div
              class="p-4 bg-gray-50 rounded-full text-gray-400 ring-1 ring-gray-200"
            >
              <Icon icon="ph:clipboard-text" width="44" height="44" />
            </div>
            <div>
              <p class="text-gray-900 font-semibold text-lg">No tasks found</p>
              <p class="text-gray-500 text-sm mt-1" v-if="store.statusFilter">
                Try changing the filter to see more tasks.
              </p>
              <p class="text-gray-500 text-sm mt-1" v-else>
                Create your first task to get started.
              </p>
            </div>

            <button
              @click="isCreateModalOpen = true"
              class="mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            >
              <Icon icon="ph:plus" width="18" height="18" />
              New Task
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Task Modal -->
    <TaskModal
      :is-open="isCreateModalOpen"
      @close="isCreateModalOpen = false"
      @created="refreshList"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useTasksStore } from "~/stores/tasks";
import { Icon } from "@iconify/vue";

const store = useTasksStore();
const isCreateModalOpen = ref(false);
const viewMode = ref<"grid" | "table">("grid");

// ✅ do NOT top-level await (it blocks SSR render)
const { status, error, execute } = useAsyncData(
  "tasks-page",
  () => store.fetchTasks(),
  {
    immediate: false,
    server: false,
    lazy: true,
  }
);

onMounted(() => {
  execute();
});

const refreshList = async () => {
  // Wait for store update (which is synchronous on client usually) but re-sorting/filtering might happen
  // store list is already updated by createTask action pushing to array.
  // Just ensuring reactivity triggers layout updates if needed.
};

/**
 * Segmented-control styles
 */
const segBtn = (active: boolean) =>
  [
    "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
    active
      ? "bg-indigo-600 text-white shadow-sm"
      : "text-gray-700 hover:bg-gray-50",
  ].join(" ");

const pill = (active: boolean) =>
  active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700";

/**
 * Counts (nice UX, cheap compute)
 */
const counts = computed(() => {
  const all = store.tasks?.length ?? 0;
  const todo = (store.tasks ?? []).filter((t) => t.status === "todo").length;
  const inProgress = (store.tasks ?? []).filter(
    (t) => t.status === "in-progress"
  ).length;
  const done = (store.tasks ?? []).filter((t) => t.status === "done").length;

  return { all, todo, inProgress, done };
});

const asyncStatus = computed(() => status.value);
const asyncError = computed(() => error.value);
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4"
  >
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <ErrorIllustration />
      </div>

      <h1 class="text-4xl font-bold text-gray-900 mb-2">
        {{ error.statusCode === 404 ? "Page Not Found" : "An Error Occurred" }}
      </h1>

      <p class="text-lg text-gray-600 mb-8">
        {{ error.statusMessage || "Something went wrong." }}
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="handleClearError"
          class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm hover:shadow"
        >
          Back to Tasks
        </button>
        <NuxtLink
          to="/"
          class="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Go Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const handleClearError = () => {
  clearError({ redirect: "/tasks" });
};
</script>

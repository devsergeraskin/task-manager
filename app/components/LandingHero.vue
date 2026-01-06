<template>
  <div
    class="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4"
  >
    <h1
      class="text-5xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
    >
      Manage Your Tasks Efficiently
    </h1>
    <p class="text-xl text-gray-600 mb-8 max-w-2xl">
      Stay organized, focused, and get more done with our simple and intuitive
      task management solution.
    </p>
    <div class="flex gap-4">
      <NuxtLink
        to="/tasks"
        class="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        Get Started
      </NuxtLink>
    </div>
  </div>
</template>

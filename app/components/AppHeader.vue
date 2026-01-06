<template>
  <header class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <AppLogo
              class="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform"
            />
            <span
              class="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors"
              >TASK MANAGER</span
            >
          </NuxtLink>
          <nav class="ml-8 flex gap-4">
            <NuxtLink
              to="/"
              class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              active-class="text-indigo-600"
            >
              HOME
            </NuxtLink>
            <NuxtLink
              to="/tasks"
              class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              active-class="text-indigo-600"
            >
              TASKS
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

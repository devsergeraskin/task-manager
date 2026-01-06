<template>
  <div class="h-screen flex flex-col overflow-hidden bg-gray-50">
    <!-- Header stays at the top, non-scrolling -->
    <AppHeader />

    <!-- Main content area scrolls independently -->
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<template>
  <svg
    class="w-full max-w-xs mx-auto text-indigo-600"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Face -->
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="2"
      class="text-indigo-200"
      fill="currentColor"
      fill-opacity="0.1"
    />

    <!-- Eyes -->
    <g class="animate-blink">
      <circle cx="8" cy="9" r="1.5" fill="currentColor" />
      <circle cx="16" cy="9" r="1.5" fill="currentColor" />
    </g>

    <!-- Tear -->
    <path
      d="M15 14C15 14 16 15 16 16C16 17 15.5 17.5 15 17.5C14.5 17.5 14 17 14 16C14 15 15 14 15 14Z"
      fill="#60A5FA"
      class="animate-drop opacity-0"
    />

    <!-- Sad Mouth -->
    <path
      d="M8 16C8 16 10 14 12 14C14 14 16 16 16 16"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
@keyframes blink {
  0%,
  100% {
    transform: scaleY(1);
  }
  5% {
    transform: scaleY(0.1);
  }
  10% {
    transform: scaleY(1);
  }
}

@keyframes drop {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    transform: translateY(10px);
    opacity: 1;
  }
  100% {
    transform: translateY(12px);
    opacity: 0;
  }
}

.animate-blink {
  transform-origin: center;
  animation: blink 4s infinite;
}

.animate-drop {
  animation: drop 3s infinite 1s;
}
</style>

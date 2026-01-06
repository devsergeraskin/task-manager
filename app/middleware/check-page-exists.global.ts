export default defineNuxtRouteMiddleware((to) => {
  if (to.matched.length === 0) {
    return abortNavigation(
      createError({
        statusCode: 404,
        statusMessage: `Page ${to.path} not found`,
        fatal: true,
      })
    );
  }
});

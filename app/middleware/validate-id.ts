export default defineNuxtRouteMiddleware((to) => {
  const id = Number(to.params.id);
  console.log(id);
  if (Number.isNaN(id)) {
    return abortNavigation(
      createError({
        statusCode: 404,
        statusMessage: "Page not found",
        fatal: true,
      })
    );
  }
});

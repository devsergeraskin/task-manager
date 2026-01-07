import { deleteTask } from "~~/server/utils/tasks-store";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task ID is required",
    });
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const success = await deleteTask(Number(id));
  if (!success) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
    });
  }

  return { success: true };
});

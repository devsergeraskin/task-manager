import { createTask } from "~~/server/utils/tasks-store";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Basic validation
  if (!body.title) {
    throw createError({
      statusCode: 400,
      statusMessage: "Title is required",
    });
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newTask = await createTask({
    title: body.title,
    description: body.description || "",
    status: body.status || "todo",
  });

  return newTask;
});

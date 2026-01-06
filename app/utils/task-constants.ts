export const TASK_STATUS_DEFINITIONS = [
  { value: "todo", label: "To Do", icon: "ph:circle" },
  { value: "in-progress", label: "In Progress", icon: "ph:clock" },
  { value: "done", label: "Done", icon: "ph:check-circle" },
] as const;

export type TaskStatus = (typeof TASK_STATUS_DEFINITIONS)[number]["value"];

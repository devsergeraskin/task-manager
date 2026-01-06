import { getTasks } from '../utils/tasks-store';

export default defineEventHandler(async () => {
  return getTasks();
});
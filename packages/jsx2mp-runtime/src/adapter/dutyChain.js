export default function(...tasks) {
  for (let i = 0; i < tasks.length; i++) {
    const result = tasks[i]();
    if (result) {
      return result;
    }
  }
  return null;
}

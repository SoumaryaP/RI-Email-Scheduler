import "./workers/email.worker.js";

console.log("🚀 Email Worker Started");
import { emailQueue } from "./queue/email.queue.js";
import "./workers/email.worker.js";

console.log("🚀 Email Worker Started");

(async () => {
  const counts = await emailQueue.getJobCounts();
  console.log("📊 Queue Counts:", counts);
})();
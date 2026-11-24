"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_queue_js_1 = require("./queue/email.queue.js");
require("./workers/email.worker.js");
console.log("🚀 Email Worker Started");
(async () => {
    const counts = await email_queue_js_1.emailQueue.getJobCounts();
    console.log("📊 Queue Counts:", counts);
})();

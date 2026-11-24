import "dotenv/config";
import app from "./app.js";

if (process.env.RUN_EMAIL_WORKER !== "false") {
  void import("./workers/email.worker.js");
} else {
  console.log("Email worker disabled by RUN_EMAIL_WORKER=false");
}

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
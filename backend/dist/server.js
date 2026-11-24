"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_js_1 = __importDefault(require("./app.js"));
if (process.env.RUN_EMAIL_WORKER !== "false") {
    void import("./workers/email.worker.js");
}
else {
    console.log("Email worker disabled by RUN_EMAIL_WORKER=false");
}
const PORT = Number(process.env.PORT) || 5000;
app_js_1.default.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

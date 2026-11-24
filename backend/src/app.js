import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (_, res) => {
    res.send("Email Scheduler API Running 🚀");
});
export default app;
//# sourceMappingURL=app.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const ioredis_1 = __importDefault(require("ioredis"));
const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const useTls = process.env.REDIS_TLS === "true";
const redis = new ioredis_1.default({
    host: redisHost,
    port: redisPort,
    password: process.env.REDIS_PASSWORD || undefined,
    tls: useTls ? {} : undefined,
    maxRetriesPerRequest: null,
});
redis.on("connect", () => {
    console.log("✅ Redis Connected");
});
redis.on("error", (err) => {
    console.error("❌ Redis Error:", err);
});
exports.default = redis;

import "dotenv/config";
import IORedis from "ioredis";

const isProduction = process.env.NODE_ENV === "production";
const configuredHost = process.env.REDIS_HOST;
const redisHost = configuredHost || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisPassword = process.env.REDIS_PASSWORD;

if (isProduction && !configuredHost) {
  throw new Error("REDIS_HOST must be configured in production");
}

if (isProduction && !redisPassword) {
  throw new Error("REDIS_PASSWORD must be configured in production");
}

const useTls =
  process.env.REDIS_TLS?.toLowerCase() === "true" ||
  redisHost.endsWith(".upstash.io");

const redis = new IORedis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  tls: useTls ? {} : undefined,
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

export default redis;
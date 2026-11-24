import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../config/redis.js";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args: string[]) => redis.call((args as any)[0], ...args.slice(1)) as any,
    }),
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args: string[]) => redis.call((args as any)[0], ...args.slice(1)) as any,
    }),
    message: {
        success: false,
        message: "Too many login attempts."
    }
});
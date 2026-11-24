"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = require("rate-limit-redis");
const redis_js_1 = __importDefault(require("../config/redis.js"));
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    store: new rate_limit_redis_1.RedisStore({
        sendCommand: (...args) => redis_js_1.default.call(args[0], ...args.slice(1)),
    }),
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    store: new rate_limit_redis_1.RedisStore({
        sendCommand: (...args) => redis_js_1.default.call(args[0], ...args.slice(1)),
    }),
    message: {
        success: false,
        message: "Too many login attempts."
    }
});

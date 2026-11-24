"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const redis_1 = require("@upstash/redis");
const redis = redis_1.Redis.fromEnv();
exports.default = redis;

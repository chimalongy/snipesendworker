

import { Queue } from 'bullmq';
import redis from '../redis/redisConnect.js';
import dotenv from 'dotenv';
dotenv.config();


export const taskQueue = new Queue('task-queue', {
  connection: redis,
});

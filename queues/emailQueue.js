


import { Queue } from 'bullmq';
import redis from '../redis/redisConnect.js';
import dotenv from 'dotenv';
dotenv.config();



export const emailQueue = new Queue('email-queue', {
  connection: redis,
});

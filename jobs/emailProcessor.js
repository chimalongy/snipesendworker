import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import { sendEmail } from "../utils/emailSender.js";

import redis from "../redis/redisConnect.js";

export function emailWorker() {
  new Worker(
    "email-queue", // queue name must match the producer
    async (job) => {
      const { email, smtpConfig, sendername, newtaskbody,taskSubject } = job.data;
      try {
        // console.log(smtpConfig )
        await sendEmail(email, smtpConfig, sendername, newtaskbody,taskSubject);
        console.log("✅ Sent email to", email);
      } catch (err) {
        console.error("❌ Failed to send email to", email, err);
      }
    },
    {
      connection: redis,
    }
  );
}

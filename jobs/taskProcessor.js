import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import redis from "../redis/redisConnect.js";
import { emailQueue } from "../queues/emailQueue.js"; // ✅ Make sure path and .js are correct

export function taskWorker() {
  new Worker(
    "task-queue", // make sure this matches the producer queue name
    async (job) => {
      console.log("Processing tasks");
      const { recipients, smtp, interval, outboundname, taskname,taskBody, taskSubject, sendername, signature } = job.data;
      console.log(
        "Triggering task:",
        taskname,
        "of",
        outboundname,
        "at rate",
        interval
      );

    let newtaskbody = taskBody +"\n\n"+signature
      for (let i = 0; i < recipients.length; i++) {
        await emailQueue.add(
          "send-email",
          { email: recipients[i], smtpConfig: smtp, sendername, newtaskbody,taskSubject },
          { delay: i * interval * 1000 }
        );
      }

      console.log(`Scheduled ${emails.length} emails.`);
    },
    {
      connection: redis,
    }
  );
}

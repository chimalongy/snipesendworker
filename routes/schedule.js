import express from "express";
import { taskQueue } from "../queues/taskQueue.js";

const router = express.Router();

router.use(express.json()); // ensure body is parsed

router.post("/", async (req, res) => {
  console.log("🔁 Hitting worker endpoint");

  const {
    triggerAt,
    recipients,
    smtp,
    interval,
    outboundname,
    outboundId,
    taskSubject,
    taskBody,
    taskname,
    sendername,
    signature,
  } = req.body;

  if (
    !triggerAt ||
    !recipients ||
    !smtp ||
    !interval ||
    !outboundname ||
    !outboundId ||
    !taskBody ||
    !taskSubject ||
    !taskname ||
    !outboundId ||
    !sendername ||
    !signature
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const triggerDate = new Date(triggerAt);
  const triggerTimeMs = triggerDate.getTime();
  const nowMs = Date.now();
  const delay = triggerTimeMs - nowMs;

  const humanTime = triggerDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log("🛬 Received triggerAt:", triggerAt);
  console.log("🕒 Human-readable trigger time:", humanTime);
  console.log("🕒 Parsed triggerAt (ms):", triggerTimeMs);
  console.log("🕒 Current time (ms):   ", nowMs);
  console.log("⏱️  Computed delay (ms):", delay);
  console.log("✅ All required fields are available");

  if (delay < 1000) {
    return res
      .status(400)
      .json({
        success: false,
        message: "triggerAt is in the past or too soon",
      });
  }

  try {
    await taskQueue.add(
      "scheduled-task",
      { recipients, smtp, interval, outboundname, taskname,taskBody, taskSubject, sendername, signature },
      { delay }
    );
    console.log("✅ Task scheduled successfully");
    return res.json({ success: true, message: "Task scheduled" });
  } catch (error) {
    console.error("❌ Worker error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Worker failed to schedule task" });
  }
});

export default router;

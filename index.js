import express from 'express';
import dotenv from 'dotenv';
import { taskWorker } from './jobs/taskProcessor.js';
import { emailWorker } from './jobs/emailProcessor.js';
import scheduleRouter from './routes/schedule.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/schedule', scheduleRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Worker API running on port ${PORT}`);
});

// Start workers
taskWorker();
emailWorker();

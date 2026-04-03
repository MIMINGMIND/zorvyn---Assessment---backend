import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import apiRouter from './routes/api';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

// Global error handling
app.use(errorHandler);

export default app;

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import analysisRouter from './routes/analysis';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: '*', // We can restrict this to frontend URL later if needed
  credentials: true,
}));

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing API mounts
app.use('/api/auth', authRouter);
app.use('/api/analysis', analysisRouter);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error occurred',
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`ApplyWise.io Backend is running on port ${PORT}`);
});

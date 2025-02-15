import express from 'express';
import cors from 'cors';
import secretSantaRoutes from './routes/secretSanta';
import connectDB from './config/db';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/secret-santa', secretSantaRoutes);

connectDB();

export default app; 
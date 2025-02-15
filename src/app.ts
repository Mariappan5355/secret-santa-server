import express from 'express';
import cors from 'cors';
import secretSantaRoutes from './routes/secretSanta.js';
import connectDB from './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/secret-santa', secretSantaRoutes);

connectDB();

export default app; 
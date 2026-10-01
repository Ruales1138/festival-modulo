import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import boletasRouter from './infrastructure/routes/boletas.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'API Festival Picnic 2026' });
});

app.use('/api/boletas', boletasRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;

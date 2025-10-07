
import express from 'express';
import cors from 'cors';
import propertyRoutes from './routes/property.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/properties', propertyRoutes);

app.get('/', (req, res) => {
  res.send('Scrapping Backend is running 🚀');
});

export default app;

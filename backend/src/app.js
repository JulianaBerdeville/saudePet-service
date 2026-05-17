const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const eventRoutes = require('./routes/events');

const app = express();

app.use(helmet());

// CORS
const corsOriginEnv = process.env.CORS_ORIGIN;
let corsOptions;
if (process.env.NODE_ENV === 'production') {
  corsOptions = {
    origin: corsOriginEnv ? corsOriginEnv.split(',') : [],
    credentials: true,
  };
} else {
  corsOptions = {
    origin: true,
    credentials: true,
  };
}
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'muitas requisições a partir deste IP. Tente novamente mais tarde',
});
app.use(limiter);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/events', eventRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'rota não encontrada' });
});

// Error handler
app.use(errorHandler);

module.exports = app;

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`[APP] servidor rodando em http://localhost:${PORT}`);
      console.log(`[APP] health check: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('[APP] erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

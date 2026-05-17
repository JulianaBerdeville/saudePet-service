const { connect } = require('mongoose');

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log('[DATABASE] MongoDB conectado');
  } catch (error) {
    console.error('[DATABASE] Erro ao estabelecer conexão:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

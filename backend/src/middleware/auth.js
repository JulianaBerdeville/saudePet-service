const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'token não fornecido' });
    }

    const token = authHeader.substring(7);
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: 'token inválido ou expirado' });
    }

    const user = await User.findById(decodedToken.userId);
    if (!user || !user.active) {
      return res.status(401).json({ error: 'usuário não encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'erro ao verificar autenticação' });
  }
};

module.exports = authMiddleware;

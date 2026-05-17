const { hash, compare } = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const User = require('../models/User');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // frontend valida: o input deve conferir se há menos que 6 chars
    // if (!name || !email || !password || !passwordConfirm) {
    //   return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    // }

    // frontend valida: o input deve conferir se há menos que 6 chars
    // if (password !== passwordConfirm) {
    //   return res.status(400).json({ error: 'As senhas não coincidem' });
    // }

    // frontend valida: o input deve conferir se há menos que 6 chars
    // if (password.length < 6) {
    //   return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
    // }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Este email já está registrado' });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email e senha são obrigatórios' });
    }

    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user || !user.active) {
      return res.status(401).json({ error: 'usuário não encontrado' });
    }

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'usuário ou senha incorretos' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'login realizado',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.status(204).send();
};

const deactivateAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(userId, { active: false }, { new: true });

    res.status(200).json({
      message: 'conta desativada',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        active: user.active,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        active: user.active,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  deactivateAccount,
  getCurrentUser,
};

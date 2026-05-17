const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'nome do usuário é obrigatório'],
      trim: true,
      minlength: [2, 'nome deve conter no mínimo 2 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'email é obrigatório'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'email deve ser válido'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);

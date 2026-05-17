const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'nome do pet é obrigatório'],
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

petSchema.index({ owner: 1 });

module.exports = mongoose.model('Pet', petSchema);

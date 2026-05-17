const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'eveno deve estar vinculado a um pet'],
    },
    date: {
      type: Date,
      required: [true, 'data do evento é obrigatória'],
    },
    notes: {
      type: String,
      trim: true,
    },
    vaccine: {
      name: { type: String, trim: true, maxlength: 20 },
      manufactureDate: {
        year: { type: Number, min: 1900, max: new Date().getFullYear() },
        month: { type: Number, min: 1, max: 12 },
      },
      part: { type: String, trim: true },
      serialNumber: { type: String, trim: true },
      applicationDate: { type: Date },
      additionalInfo: { type: String, trim: true },
    },
    type: {
      type: String,
      enum: ['vacina', 'consulta', 'medicamento', 'banho', 'tosa', 'outro'],
      default: 'outro',
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ owner: 1 });
eventSchema.index({ pet: 1 });
eventSchema.index({ date: 1 });

module.exports = mongoose.model('Event', eventSchema);

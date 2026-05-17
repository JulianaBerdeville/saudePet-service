const Pet = require('../models/Pet');

const createPet = async (req, res, next) => {
  try {
    const { name, breed, dob, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'nome do pet é obrigatório' });
    }

  const pet = await Pet.create({
      owner: req.user._id,
      name,
      breed,
      dob: dob ? new Date(dob) : undefined,
       notes,
    });

    res.status(201).json({
      message: 'pet adicionado',
      pet,
    });
  } catch (error) {
    next(error);
  }
};

const getPets = async (req, res, next) => {
  try {
  const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      count: pets.length,
      pets,
    });
  } catch (error) {
    next(error);
  }
};

const getPetById = async (req, res, next) => {
  try {
    const { id } = req.params;

  const pet = await Pet.findOne({ _id: id, owner: req.user._id });

    if (!pet) {
      return res.status(404).json({ error: 'pet não encontrado' });
    }

    res.status(200).json({ pet });
  } catch (error) {
    next(error);
  }
};

const updatePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, breed, dob, notes } = req.body;

  const pet = await Pet.findOne({ _id: id, owner: req.user._id });

    if (!pet) {
      return res.status(404).json({ error: 'pet não encontrado' });
    }

    if (name) pet.name = name;
    if (breed) pet.breed = breed;
    if (dob) pet.dob = new Date(dob);
    if (notes !== undefined) pet.notes = notes;

    await pet.save();

    res.status(200).json({
      message: 'dados do pet atualizados',
      pet,
    });
  } catch (error) {
    next(error);
  }
};

const deletePet = async (req, res, next) => {
  try {
    const { id } = req.params;

  const pet = await Pet.findOne({ _id: id, owner: req.user._id });

    if (!pet) {
      return res.status(404).json({ error: 'pet não encontrado' });
    }

  await Pet.deleteOne({ _id: id });

    const Event = require('../models/Event');
    await Event.deleteMany({ pet: id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
};

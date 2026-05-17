const Event = require('../models/Event');
const Pet = require('../models/Pet');

const createEvent = async (req, res, next) => {
  try {
    const { date, petId, notes, type, vaccine } = req.body;

    if (!date || !petId) {
      return res.status(400).json({ error: 'data e pet são obrigatórios' });
    }

    const pet = await Pet.findOne({ _id: petId, owner: req.user._id });
    if (!pet) {
      return res.status(404).json({ error: 'pet não encontrado' });
    }

    const eventData = {
      owner: req.user._id,
      pet: petId,
      date: new Date(date),
      notes,
      type,
    };

    if (type === 'vacina' && vaccine) {
      const { name, manufactureDate, applicationDate } = vaccine;
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'nome da vacina é obrigatório' });
      }
      if (name.length > 20) {
        return res.status(400).json({ error: 'nome da vacina deve ter no máximo 20 caracteres' });
      }
      if (!manufactureDate || !manufactureDate.trim()) {
        return res.status(400).json({ error: 'data de fabricação é obrigatória' });
      }
      const mdRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
      if (!mdRegex.test(manufactureDate)) {
        return res.status(400).json({ error: 'data de fabricação deve estar no formato YYYY-MM' });
      }

      if (applicationDate) {
        const ad = new Date(applicationDate);
        if (isNaN(ad.getTime())) {
          return res.status(400).json({ error: 'data de aplicação inválida' });
        }
        vaccine.applicationDate = ad;
      }

      eventData.vaccine = {
        ...vaccine,
        manufactureDate: manufactureDate,
      };
    }

    const event = await Event.create(eventData);

    res.status(201).json({
      message: 'evento criado',
      event,
    });
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const { petId, from, to } = req.query;

    const filter = { owner: req.user._id };

    if (petId) {
      filter.pet = petId;
    }

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const events = await Event.find(filter).populate('pet').sort({ date: -1 });

    res.status(200).json({
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({ _id: id, owner: req.user._id }).populate('pet');

    if (!event) {
      return res.status(404).json({ error: 'evento não encontrado' });
    }

    res.status(200).json({ event });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, petId, notes, type, vaccine } = req.body;

    const event = await Event.findOne({ _id: id, owner: req.user._id });

    if (!event) {
      return res.status(404).json({ error: 'evento não encontrado' });
    }

    if (petId && petId !== event.pet.toString()) {
      const pet = await Pet.findOne({ _id: petId, owner: req.user._id });
      if (!pet) {
        return res.status(404).json({ error: 'pet não encontrado' });
      }
      event.pet = petId;
    }

    if (date) event.date = new Date(date);
    if (notes !== undefined) event.notes = notes;
    if (type) event.type = type;

    if (type === 'vacina' && vaccine) {
      const { name, manufactureDate, applicationDate } = vaccine;
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'nome da vacina é obrigatório' });
      }
      if (name.length > 20) {
        return res.status(400).json({ error: 'nome da vacina deve ter no máximo 20 caracteres' });
      }
      if (!manufactureDate || !manufactureDate.trim()) {
        return res.status(400).json({ error: 'data de fabricação é obrigatória' });
      }
      const mdRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
      if (!mdRegex.test(manufactureDate)) {
        return res.status(400).json({ error: 'data de fabricação deve estar no formato YYYY-MM' });
      }
      if (applicationDate) {
        const ad = new Date(applicationDate);
        if (isNaN(ad.getTime())) {
          return res.status(400).json({ error: 'data de aplicação inválida' });
        }
        vaccine.applicationDate = ad;
      }

      event.vaccine = {
        ...vaccine,
        manufactureDate: manufactureDate,
      };
    } else if (type !== 'vacina') {
      event.vaccine = undefined;
    }

    await event.save();

    res.status(200).json({
      message: 'evento atualizado com sucesso',
      event,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({ _id: id, owner: req.user._id });

    if (!event) {
      return res.status(404).json({ error: 'evento não encontrado' });
    }

    await Event.deleteOne({ _id: id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};

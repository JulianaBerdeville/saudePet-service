import client from './client';

// Accept a data object (may include vaccine subobject) and post to /events
export const createEvent = async (data) => {
  const response = await client.post('/events', data);
  return response.data;
};

export const getEvents = async (filters = {}) => {
  const response = await client.get('/events', {
    params: filters,
  });
  return response.data;
};

export const getEventById = async (id) => {
  const response = await client.get(`/events/${id}`);
  return response.data;
};

export const updateEvent = async (id, data) => {
  const response = await client.put(`/events/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await client.delete(`/events/${id}`);
  return response.data;
};

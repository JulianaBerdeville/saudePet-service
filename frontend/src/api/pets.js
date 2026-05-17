import client from './client';

export const createPet = async (name, breed, dob, notes) => {
  const response = await client.post('/pets', {
    name,
    breed,
    dob,
    notes,
  });
  return response.data;
};

export const getPets = async () => {
  const response = await client.get('/pets');
  return response.data;
};

export const getPetById = async (id) => {
  const response = await client.get(`/pets/${id}`);
  return response.data;
};

export const updatePet = async (id, data) => {
  const response = await client.put(`/pets/${id}`, data);
  return response.data;
};

export const deletePet = async (id) => {
  const response = await client.delete(`/pets/${id}`);
  return response.data;
};

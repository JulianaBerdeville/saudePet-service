import client, { setAuthToken } from './client';

export const register = async (name, email, password, passwordConfirm) => {
  const response = await client.post('/auth/register', {
    name,
    email,
    password,
    passwordConfirm,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await client.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const logout = async () => {
  const response = await client.post('/auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await client.get('/auth/me');
  return response.data;
};

export const deactivateAccount = async () => {
  const response = await client.delete('/auth/account');
  return response.data;
};

export { setAuthToken };

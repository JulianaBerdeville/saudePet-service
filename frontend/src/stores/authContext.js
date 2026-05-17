import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken as setApiToken, clearAuthToken as clearApiToken } from '../api/client';

export const AuthContext = createContext();

const initialState = {
  isLoading: true,
  isSignout: false,
  user: null,
  token: null,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        isLoading: false,
        token: action.payload.token,
        user: action.payload.user,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case 'SIGN_UP':
      return {
        ...state,
        isSignout: false,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        user: null,
        token: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
          setApiToken(token);
          try {
            const { getCurrentUser } = require('../api/auth');
            const res = await getCurrentUser();
            const user = res?.user || null;
            dispatch({
              type: 'RESTORE_TOKEN',
              payload: {
                token,
                user,
              },
            });
          } catch (err) {
            const status = err.response?.status;
            if (status === 401 || status === 403) {
              await SecureStore.deleteItemAsync('authToken');
              clearApiToken();
              dispatch({
                type: 'RESTORE_TOKEN',
                payload: {
                  token: null,
                  user: null,
                },
              });
            } else {
              console.warn('não foi possível buscar dados do usuário:', err);
              dispatch({
                type: 'RESTORE_TOKEN',
                payload: {
                  token,
                  user: null,
                },
              });
            }
          }
        } else {
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: {
              token: null,
              user: null,
            },
          });
        }
      } catch (error) {
        console.error('erro ao restaurar token:', error);
        dispatch({
          type: 'RESTORE_TOKEN',
          payload: {
            token: null,
            user: null,
          },
        });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    state,
    signIn: useCallback(async (email, password) => {
      try {
        const { login } = require('../api/auth');
        const response = await login(email, password);

        const { token, user } = response;

        await SecureStore.setItemAsync('authToken', token);
        setApiToken(token);

        dispatch({
          type: 'SIGN_IN',
          payload: { token, user },
        });
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        dispatch({
          type: 'SET_ERROR',
          payload: errorMsg,
        });
        throw error;
      }
    }, []),

    signUp: useCallback(async (name, email, password, passwordConfirm) => {
      try {
        const { register } = require('../api/auth');
        const response = await register(name, email, password, passwordConfirm);

        const { token, user } = response;

        await SecureStore.setItemAsync('authToken', token);
        setApiToken(token);

        dispatch({
          type: 'SIGN_UP',
          payload: { token, user },
        });
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        dispatch({
          type: 'SET_ERROR',
          payload: errorMsg,
        });
        throw error;
      }
    }, []),

    signOut: useCallback(async () => {
      try {
        const { logout } = require('../api/auth');
        await logout();
      } catch (error) {
        console.warn('erro ao fazer logout na API:', error);
      } finally {
        await SecureStore.deleteItemAsync('authToken');
        clearApiToken();

        dispatch({
          type: 'SIGN_OUT',
        });
      }
    }, []),

    deactivateAccount: useCallback(async () => {
      try {
        const { deactivateAccount } = require('../api/auth');
        await deactivateAccount();

        await SecureStore.deleteItemAsync('authToken');
        clearApiToken();

        dispatch({
          type: 'SIGN_OUT',
        });
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        dispatch({
          type: 'SET_ERROR',
          payload: errorMsg,
        });
        throw error;
      }
    }, []),
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('autenticação do usuário (userAth) não está contida em AuthProvider');
  }
  return context;
};

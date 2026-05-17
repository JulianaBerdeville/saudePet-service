import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const getBaseURL = () => {
  const configApiUrl = (Constants.manifest && Constants.manifest.extra && Constants.manifest.extra.API_URL) ||
    (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.API_URL);
  if (configApiUrl) return configApiUrl;

  if (__DEV__) {
    const localhost = Platform.select({
      android: 'http://10.0.2.2:4000',

      ios: 'http://localhost:4000',

      web: 'http://localhost:4000',

      default: 'http://localhost:4000',
    });
    return localhost;
  }

  return 'https://api.saudepet.com';
};

export const API_URL = `${getBaseURL()}/api`;
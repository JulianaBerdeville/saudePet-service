import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/stores/authContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
      <StatusBar barStyle="dark-content" />
    </AuthProvider>
  );
}

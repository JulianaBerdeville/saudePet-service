import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../stores/authContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import PetFormScreen from '../screens/PetFormScreen';
import PetDetailsScreen from '../screens/PetDetailsScreen';
import EventFormScreen from '../screens/EventFormScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackTitle: 'Voltar',
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#82B1B7',
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'SaudePet' }}
    />
    <Stack.Screen
      name="PetForm"
      component={PetFormScreen}
      options={{ title: 'Pet' }}
    />
    <Stack.Screen
      name="PetDetails"
      component={PetDetailsScreen}
      options={{ title: 'Eventos do Pet' }}
    />
    <Stack.Screen
      name="EventForm"
      component={EventFormScreen}
      options={{ title: 'Evento' }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Meu Perfil' }}
    />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { state } = useAuth();

  return (
    <NavigationContainer>
      {state.isLoading ? null : state.token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;

/**
 * PulseBox App
 * A React Native streaming app
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FormsProvider } from './src/context/FormsContext';

// Import screens
import GetStarted from './src/onboarding/GetStarted';
import Onboarding01 from './src/onboarding/Onboarding01';
import Onboarding02 from './src/onboarding/Onboarding02';
import Onboarding03 from './src/onboarding/Onboarding03';
import Login from './src/authentication/Login';
import SignUp from './src/authentication/SignUp';
import Home from './src/main/Home';
import MyForms from './src/main/MyForms';
import Responses from './src/main/Responses';
import Settings from './src/main/Settings';
import CreateForm from './src/forms/CreateForm';
import FormBuilder from './src/forms/FormBuilder';

// Define navigation types
export type RootStackParamList = {
  GetStarted: undefined;
  Onboarding01: undefined;
  Onboarding02: undefined;
  Onboarding03: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  MyForms: undefined;
  Responses: undefined;
  Settings: undefined;
  MainScreen: undefined;
  CreateForm: undefined;
  FormBuilder: { answers?: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <FormsProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="GetStarted"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="GetStarted" component={GetStarted} />
          <Stack.Screen name="Onboarding01" component={Onboarding01} />
          <Stack.Screen name="Onboarding02" component={Onboarding02} />
          <Stack.Screen name="Onboarding03" component={Onboarding03} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="MyForms" component={MyForms} />
          <Stack.Screen name="Responses" component={Responses} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="CreateForm" component={CreateForm} />
          <Stack.Screen name="FormBuilder" component={FormBuilder} />
        </Stack.Navigator>
      </NavigationContainer>
      </FormsProvider>
    </SafeAreaProvider>
  );
}

export default App;

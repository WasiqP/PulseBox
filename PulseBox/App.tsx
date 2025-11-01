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
import EditForm from './src/forms/EditForm.tsx';
import QuestionsScreen from './src/forms/QuestionsScreen.tsx';
import SwapQuestionsScreen from './src/forms/SwapQuestionsScreen.tsx';
import ShareForm from './src/forms/ShareForm.tsx';

// Navigation types
import type { RootStackParamList } from './src/types/navigation';

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
          <Stack.Screen name="EditForm" component={EditForm} />
          <Stack.Screen name="QuestionsScreen" component={QuestionsScreen} />
          <Stack.Screen name="ShareForm" component={ShareForm} />
          <Stack.Screen 
            name="SwapQuestions" 
            component={SwapQuestionsScreen}
            options={{
              presentation: 'card',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </FormsProvider>
    </SafeAreaProvider>
  );
}

export default App;

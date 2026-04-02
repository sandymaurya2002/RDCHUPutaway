import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SetupScreen from '../screens/SetupScreen';
import HomeScreen from '../screens/HomeScreen';
import PutAwayScreen from '../screens/PutAwayScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Setup"
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <Stack.Screen name="Setup" component={SetupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PutAway" component={PutAwayScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

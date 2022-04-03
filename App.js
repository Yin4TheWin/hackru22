/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useReducer} from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import SBar from './SBar';
import Me from './screens/Me'
import Battle from './screens/Battle'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const Tab = createBottomTabNavigator()
  return (
    <NavigationContainer>
    <Tab.Navigator
     screenOptions={{
      headerShown: false
    }}
    >
      <Tab.Screen name="Me" options={{
        tabBarLabel: 'Me',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" color={color} size={size} />
        ),
      }} component={Me}/>
      <Tab.Screen name="Scan" options={{
        tabBarLabel: 'Scan',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="restaurant" color={color} size={size} />
        ),
      }} component={SBar}/>
      <Tab.Screen name="Battle" options={{
        tabBarLabel: 'Battle',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="sword" color={color} size={size} />
        ),
      }} component={Battle}/>
    </Tab.Navigator>
  </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

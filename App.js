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
import GoogleFit, { Scopes } from 'react-native-google-fit'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Me from './screens/Me'
import Ionicons from 'react-native-vector-icons/Ionicons';

const reducer = (state, action) => {

    switch (action.colorToChange) {
        case 'red':
            return {...state, red: state.red + action.amount};
        case 'green':
            return {...state, green: state.green + action.amount};
        case 'blue':
            return {...state, blue: state.blue + action.amount};
        default:
            return state;
    }
};
const App = () => {
 const [state, dispatch] = useReducer(reducer, {red: 0, green: 0, blue: 0});
  const [dailySteps, setdailySteps] = useState(0);
  const isDarkMode = useColorScheme() === 'dark';
  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
    ],
  };
  useEffect(()=>{
    GoogleFit.checkIsAuthorized().then(() => {
      var authorized = GoogleFit.isAuthorized;
      console.log(authorized);
      if (authorized) {
        // if already authorized, fetch data
        GoogleFit.getDailySteps().then((steps)=>{console.log(steps)}).catch()
        GoogleFit.getWeeklySteps().then((steps)=>{console.log(steps)}).catch()
      } else {
        // Authentication if already not authorized for a particular device
        GoogleFit.authorize(options)
          .then(authResult => {
            if (authResult.success) {
              console.log('AUTH_SUCCESS');
              const opt = {
                startDate: "2022-04-02T00:00:17.971Z", // required ISO8601Timestamp
                endDate: new Date().toISOString(), // required ISO8601Timestamp
                bucketInterval: 1, // optional - default 1. 
              };
              GoogleFit.getDailyStepCountSamples(opt).then((res)=>{res.forEach(el=>{
                if(el.source.includes("google")){
                  console.log(el.steps)
                }
              })})
              // if successfully authorized, fetch data
            } else {
              console.log('AUTH_DENIED ' + authResult.message);
            }
          })
          .catch((err) => {
            console.log(err)
          });
      }
  });
  }, [])
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
      }} component={Me}/>
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

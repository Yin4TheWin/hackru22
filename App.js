/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useReducer} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import GoogleFit, { Scopes } from 'react-native-google-fit'

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};
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
 // const dispatch = useDispatch()
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

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>

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

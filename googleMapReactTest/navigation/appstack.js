import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  SafeAreaView,

} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from '../screens/mainscreen';
import AnalysisScreen from '../screens/analysismainscreen';
import AnalysisReport from '../screens/analysisareascreen';
import AnalysisPath from '../screens/analysispath';
import HotSpotScreen from '../screens/hotspotprediction';
import UserInput from '../screens/userinput';
import LandmineScreen from '../screens/landminedetection';
import MapScreen from '../screens/map';
import ArScreen from '../screens/arscreen';
import AppTab from './appTab'
import UserInputDest from '../screens/userinputdest';

const Stack = createNativeStackNavigator();

const AppStack = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='mainScreen'>
        <Stack.Screen
          name="mainScreen"
          component={MainScreen}
          options={{
            title: 'HOME',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Analysis Report"
          component={AnalysisScreen}
        />
        <Stack.Screen
          name="Analysis Area Report"
          component={AnalysisReport}
        />
        <Stack.Screen
          name="Analysis Path"
          component={AnalysisPath}
        />
        <Stack.Screen
          name="Landmine Detection"
          component={LandmineScreen}
        />

        <Stack.Screen
          name="Hotspot Prediction"
          component={HotSpotScreen}
        />

        <Stack.Screen
          name="arscreen"
          component={ArScreen}
        />
        <Stack.Screen
          name="Traveling Information"
          component={UserInputDest}
        />

        <Stack.Screen
          name="User Input"
          component={UserInput}
        />

        <Stack.Screen
          name="Traveling"
          component={AppTab}

        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default AppStack;
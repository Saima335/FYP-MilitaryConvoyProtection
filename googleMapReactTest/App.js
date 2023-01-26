/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import AppStack from './navigation/appstack';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const App = () => {

  const markers = [{
    latlng: {
      latitude: 30.3753,
      longitude: 69.3451,
    }, title: "Pakistan", description: "Marker Showed"
  },
  {
    latlng: {
      latitude: 29.3735,
      longitude: 68.3451,
    }, title: "Another in Pakistan", description: "Marker Showed again"
  }]

  return (
    <View style={{flex:1}}>
      <AppStack />
    </View>
  );
};

const styles = StyleSheet.create({

});

export default App;

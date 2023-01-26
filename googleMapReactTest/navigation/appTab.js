import React from 'react';
import HotSpotScreen from '../screens/hotspotprediction';
import MapScreen from '../screens/map';
import LandmineScreen from '../screens/landminedetection';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import ArScreen from '../screens/arscreen';
import { StyleSheet,Text,View,Image,TouchableOpacity } from 'react-native';
const Tab = createBottomTabNavigator();

const AppTab = () => {
  
    return (
      <Tab.Navigator
      screenOptions={{
        tabBarActiveBackgroundColor: 'green',
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        
        headerStyle: {
          backgroundColor: 'green',

        },
        tabBarStyle: {
          //  backgroundColor: '#b0e0e6',
          backgroundColor: 'mediumseagreen',
          height: 65,

        }
      }}
    >

      <Tab.Screen
        name="map"
        component={MapScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Map',
          tabBarIcon: ({ focused, color }) => (

            <Image
              source={focused ? require('../images/myhome.png') : require('../images/myhome.png')}
              style={{
                flex: 1,
                width: 30,
                height: 30,
                resizeMode: 'contain'
              }} />
          ),
        }} />

      <Tab.Screen
        name="hotspotScreen"
        component={HotSpotScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Hotspot Areas',
          tabBarIcon: ({ focused, color }) => (

            <Image
              source={focused ? require('../images/redzone.png') : require('../images/redzone.png')}
              style={{
                flex: 1,
                width: 30,
                height: 30,
                resizeMode: 'contain'
              }} />
          ),
        }} />

      <Tab.Screen
        name="landmineDetection"
        component={LandmineScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Landmine Detected Areas',
          tabBarIcon: ({ focused, color }) => (

            <Image source={focused ? require('../images/landmine.png') : require('../images/landmine.png')}
              style={{
                flex: 1,
                width: 30,
                height: 30,
                resizeMode: 'contain'
              }} />
          ),
        }} />
       
      <Tab.Screen
        name="ar"
        component={ArScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'AR Camera',
          tabBarIcon: ({ focused, color }) => (

            <Image source={focused ? require('../images/camera-icon.png') : require('../images/camera-icon.png')}
              style={{
                flex: 1,
                width: 30,
                height: 30,
                resizeMode: 'contain'
              }} />
          ),
        }} />

    </Tab.Navigator>
    
    );
};
const styles = StyleSheet.create({
  shadow:{
    shadowColor:'#7F5SDF0',
    shadowOffset:{
      height:10,
      width:0,
    },
    shadowOpacity:0.25,
    shadowRadius:3.5,
    elevation:5,
    
  }     
  });
export default AppTab;